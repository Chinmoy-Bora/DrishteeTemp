import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import theme from '../../utils/theme';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


const DateFilter = ({ onFilterChange }) => {
  const [filter, setFilter] = useState('Today');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [isFromDatePickerVisible, setFromDatePickerVisibility] = useState(false);
  const [isToDatePickerVisible, setToDatePickerVisibility] = useState(false);

  const predefinedFilters = {
    Today: {
      from: moment().startOf('day').toDate(),
      to: moment().endOf('day').toDate(),
    },
    Yesterday: {
      from: moment().subtract(1, 'days').startOf('day').toDate(),
      to: moment().subtract(1, 'days').endOf('day').toDate(),
    },
    'This Week': {
      from: moment().startOf('week').toDate(),
      to: moment().endOf('week').toDate(),
    },
    'Last Week': {
      from: moment().subtract(1, 'week').startOf('week').toDate(),
      to: moment().subtract(1, 'week').endOf('week').toDate(),
    },
    'Last Month': {
      from: moment().subtract(1, 'month').startOf('month').toDate(),
      to: moment().subtract(1, 'month').endOf('month').toDate(),
    },
  };

  const handleFilterSelect = (selectedFilter) => {
    setFilter(selectedFilter);
    setShowDropdown(false);
    console.log("Filter seletion",selectedFilter)

    if (selectedFilter === 'Custom') {
      setShowCustomPicker(true);
    } else {
      const dates = predefinedFilters[selectedFilter];
      onFilterChange(dates.from, dates.to,selectedFilter);
    }
  };

  const handleCustomSubmit = () => {
    onFilterChange(fromDate, toDate,filter);
    setShowCustomPicker(false);
  };
  useFocusEffect(
    useCallback(() => {
      setFilter('Today')
      
    }, [])
  );

  return (
    <View style={styles.filterContainer}>
      {/* Filter Button */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowDropdown((prev) => !prev)}
      >
        <Text style={styles.filterText}>{filter}</Text>
      </TouchableOpacity>

      {/* Dropdown for filter options */}
      {showDropdown && (
        <View style={styles.dropdown}>
          {Object.keys(predefinedFilters).map((key) => (
            <TouchableOpacity
              key={key}
              onPress={() => handleFilterSelect(key)}
              style={styles.dropdownOption}
            >
              <Text style={styles.dropdownText}>{key}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => handleFilterSelect('Custom')}
            style={styles.dropdownOption}
          >
            <Text style={styles.dropdownText}>Custom</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Custom date picker modal */}
      {showCustomPicker && (
        <Modal transparent={true} animationType="slide" visible={showCustomPicker}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Date Range</Text>

              {/* From Date */}
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setFromDatePickerVisibility(true)}
              >
                <Text style={styles.dateButtonText}>
                  From Date: {moment(fromDate).format('DD/MM/YYYY')}
                </Text>
              </TouchableOpacity>

              {/* To Date */}
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setToDatePickerVisibility(true)}
              >
                <Text style={styles.dateButtonText}>
                  To Date: {moment(toDate).format('DD/MM/YYYY')}
                </Text>
              </TouchableOpacity>

              {/* OK Button */}
              <Button title="OK" onPress={handleCustomSubmit} />

              {/* From DatePicker */}
              {isFromDatePickerVisible && (
                <DateTimePicker
                  value={fromDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setFromDatePickerVisibility(false);
                    setFromDate(selectedDate || fromDate);
                  }}
                />
              )}

              {/* To DatePicker */}
              {isToDatePickerVisible && (
                <DateTimePicker
                  value={toDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setToDatePickerVisibility(false);
                    setToDate(selectedDate || toDate);
                  }}
                />
              )}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    width: 120,
  },
  filterButton: {
    padding: 8,
    backgroundColor: theme.colors.backgroundFour,
    borderRadius: 20,
    
    borderColor: theme.colors.secondary,
    alignItems: 'center',
    shadowColor: theme.colors.backgroundFour,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 2, // For Android shadow support
  },
  filterText: {
    color: theme.fonts,
    fontSize: 12,
    fontWeight: '600',
  },
  dropdown: {
    position: 'absolute',
    top: 38,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.borderOne,
    borderWidth: 0.5,
    borderColor: theme.colors.borderOne,
    borderRadius: 5,
    zIndex: 999,
  },
  dropdownOption: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.borderOne,
    
  },
  dropdownText: {
    fontSize: 12,
    color: theme.fonts.fontFour,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.colors.primary,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 20,
    color: theme.fonts.fontTwo,
    textAlign: 'center',
  },
  dateButton: {
    paddingVertical: 10,
    backgroundColor: theme.colors.backgroundFour,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 14,
    color: theme.fonts.fontTwo,
  },
});

export default DateFilter;
