import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator,Alert, Modal, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './TravelExpenseScreenStyle';
import TourListCard from '../../../components/ExpensePageComponents/TourListCard';
import ExpenseHeader from '../../../components/Header/ExpenseHeader';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { EXPENSE_BASE_URL,  TOUR_EXPENSELIST_API, EXPENSE_TOKEN, LIMIT, TOUR_EXPENSE_DETAILS_API, TOUR_EXPENSE_DELETE_API, TOUR_EXPENSE_SUBMIT_API } from '@env';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import LoadMoreButton from '../../../components/ExpensePageComponents/LoadMoreButton';
import theme from '../../../utils/theme';

const TravelExpenseScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('Yet to start');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true)
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);


  const tabs = ['Yet to start', 'Ongoing', 'Completed', 'Submitted', 'Cancelled'];

  const fetchData = async (tab, newOffset = 0, append = false) => {
    setLoading(true);
    setSelectedTab(tab);

    try {
      
      const limit=LIMIT;
        const userData = await SecureStore.getItemAsync('DrishteeuserData');
        const { user_code } = JSON.parse(userData);
        console.log("Limit and Offset",newOffset,limit,tab)
        const response = await axios.post(
            `${EXPENSE_BASE_URL}${TOUR_EXPENSELIST_API}`,
            {
                token: EXPENSE_TOKEN,
                employee_id: user_code,
                offset: parseInt(newOffset),
                limit: parseInt(limit),
                status:tab
            },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            }
        );
      console.log(response.data)
        if (append) {
          setData(prevData => [...prevData, ...response.data.ExpensesList]);
        } else {
          setData(response.data.ExpensesList);
        }

        
        setOffset(Number(newOffset) + Number(limit));
        setHasMore(response.data.hasMore); 
      
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]); 
    } finally {
      setLoading(false);
    }
  };


  useFocusEffect(
    useCallback(() => {
        setOffset(0);
        fetchData(selectedTab,0, false); 
    }, [])
  );

  const loadMoreData = () => {
    if (hasMore && !loading) { 
        fetchData(selectedTab,offset, true); 
    }
  };
  const fetchExpenseDetails = async (tour_id) => {
    try {
        const response = await axios.post(`${EXPENSE_BASE_URL}${TOUR_EXPENSE_DETAILS_API}`, {
            token: EXPENSE_TOKEN,
            tour_id: tour_id
        }, {
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        });
        
        return response.data.formattedexpense;
    } catch (error) {
        console.error("Error fetching expense details:", error);
        throw error; 
    }
  };
  const editHandler= async( tour_id) => {
    setLoading(true);
    try {
      const conveyanceDetails = await fetchExpenseDetails(tour_id);
      console.log("Conveyance Data:",conveyanceDetails)
      
  
      if (conveyanceDetails) {
          
         
          
          const params = {
            tripName:conveyanceDetails.trip_name,
            startDate:conveyanceDetails.trip_start_date,
            endDate:conveyanceDetails.trip_end_date,
            remarks:conveyanceDetails.purpose_of_visit,
            tourPartner:conveyanceDetails.partner_name,
            tour_id
          };
  
          navigation.navigate('TravelExpenseForm', { ...params });
      }
  } catch (error) {
      setData([]);
  } finally {
      setLoading(false);
  }

  }
  const showDeleteConfirmation = () => {
    return new Promise((resolve) => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete this expense?",
            [
                {
                    text: "Cancel",
                    onPress: () => resolve(false), // User chose to cancel
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => resolve(true), 
                }
            ],
            { cancelable: false } 
        );
    });
  };
  
  const deleteHandler = async (tour_id) => {
  
    const userConfirmed = await showDeleteConfirmation();
  
    if (userConfirmed) {
      try {
        setLoading(true);
        
        const response = await axios.post(`${EXPENSE_BASE_URL}${TOUR_EXPENSE_DELETE_API}`, {
          token: EXPENSE_TOKEN,
          tour_id
        }, {
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        });
        console.log(response.data)
        fetchData(selectedTab);
        setLoading(false);
        Alert.alert("Deletion", "Expense deleted successfully.");
        
  
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    } else {
        console.log("Deletion cancelled by the user.");
    }
  
  }

  const onComplete = (expense) => {
    setSelectedExpense({
      name: expense.trip_name, 
      fromDate: expense.trip_start_date, 
      toDate: expense.trip_end_date, 
      conveyance: expense.Total_Conveyance_amount,
      food: expense.Total_Food_amount,
      accommodation: expense.Total_Accommodation_amount,
      other: expense.Total_Other_Amount,
      total: expense.Total_Expense_amount,
      id: expense.tour_id, 
    });
    setModalVisible(true);
  };

  const renderRow = (label, value) => (

    <View style={styles.tableRow}>
      <Text style={styles.tableCellLabel}>{label}</Text>
      <Text style={styles.tableCellValue}>{value}</Text>
    </View>
  );

  const handleComplete = async (tour_id) => {
    try {
      setLoading(true);
        const response = await axios.post(
            `${EXPENSE_BASE_URL}${TOUR_EXPENSE_SUBMIT_API}`,
            {
                token: EXPENSE_TOKEN,
                tour_id
                
            },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            }
        );
      console.log("Sumitted data",response.data)
       
      setModalVisible(false);
      fetchData(selectedTab);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]); 
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <SafeAreaView style={{flex:1,backgroundColor:theme.colors.headerColor}}>
    <View style={styles.container}>
       <ExpenseHeader
      title="Tour List" 
      onPress={() => navigation.goBack()}
      showBackArrow={true} 
    />

      <View style={styles.fixedTabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => fetchData(tab)}
              style={[
                styles.tabItem,
                selectedTab === tab && styles.activeTabItem,
              ]}
            >
              <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.contentContainer}>
        {loading && !data?.length ? (
          <ActivityIndicator size="large" color="#FFCC00" />
        ) : data?.length > 0 ? (
          <ScrollView>
            {data?.map((item, index) => (
              <TourListCard
                key={index}
                title={item.trip_name}
                fromDate={item.trip_start_date}
                toDate={item.trip_end_date}
                totalExpenses={item.Total_Expense_amount}
                approvedExpenses={item.ApprovedExpensesCount}
                expenseCount={item.TotalexpensesCount}
                rejectedExpenses={item.RejectedExpensesCount}
                status={item.status}
                tourId={item.tour_id}
                onCompleteTour={() => onComplete(item)}
                onEdit={() =>editHandler(item.tour_id)}
                onDelete={() =>deleteHandler(item.tour_id)}
              />
            ))}
            {hasMore && (
            <LoadMoreButton onPress={loadMoreData} />
          )}
          </ScrollView>
        ) : (
          <View style={styles.emptyStateContainer}>
          <Image source={require('../../../assets/nodata.png')} style={styles.emptyStateImage} />
          <Text style={styles.noDataText}>No data available</Text>
        </View>
        )}
      </View>

      {/* Complete Popup Code */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedExpense && (
              <>
                <Text style={styles.title}>{selectedExpense.name}</Text>
                {renderRow(`From: ${selectedExpense.fromDate}`,`To: ${selectedExpense.toDate}`)}
                
                {renderRow('Conveyance: ', '₹ '+selectedExpense.conveyance || '0.00')}
                {renderRow('Food:', '₹ '+selectedExpense.food || '0.00')}
                {renderRow('Accommodation:', '₹ '+selectedExpense.accommodation || '0.00')}
                {renderRow('Other:', '₹ '+selectedExpense.other || '0.00')}
                {renderRow('Total:', '₹ '+selectedExpense.total || '0.00')}
                
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.submitButton} onPress={() => handleComplete(selectedExpense.id)}>
                    <Text style={styles.buttonText}>Submit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>


      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('TravelExpenseForm')}>
    <Icon name="add" style={styles.fabIcon} />
  </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};

export default TravelExpenseScreen;
