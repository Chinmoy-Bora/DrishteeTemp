import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import theme from '../../utils/theme';

const TourListCard = ({tourId, title, fromDate, toDate, totalExpenses, approvedExpenses, expenseCount, rejectedExpenses, status, onCompleteTour, onEdit, onDelete }) => {
    const navigation = useNavigation();
    

    return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('TourList', { title, fromDate,toDate,tourId,status })}>
          <FontAwesome name="long-arrow-right" size={25} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.dateRow}>
        <Text style={styles.dateText}>{fromDate}</Text>
        <Text style={styles.dateText}>-</Text>
        <Text style={styles.dateText}>{toDate}</Text>

      </View>

      <View style={styles.expensesRow}>
        <Text style={styles.expenseText}>Total: ₹{totalExpenses ||'0.00'}</Text>
        <Text style={styles.expenseText}>Expenses: {expenseCount || '0'}</Text>
      </View>

      {status==='Submitted' || status==="Cancelled" ?

      <View style={styles.expensesRow}>
        <Text style={styles.expenseText}>Approved: {approvedExpenses}</Text>
        <Text style={styles.expenseText}>Rejected: {rejectedExpenses}</Text>
      </View>
      :<View></View>}

      <View style={styles.footerRow}>
        <Text style={[styles.statusText, { color: status === "Submitted" ? '#007218' : '#bf0101' }]}>{status}</Text>
        {status!=="Submitted" && (
          <View style={styles.footerActions}>
          <TouchableOpacity onPress={onCompleteTour} style={styles.completeTourButton}>
            <Text style={styles.completeTourButtonText}>Complete Tour</Text>
          </TouchableOpacity>
          {
            status !=="Completed" && (
              <>
              <TouchableOpacity onPress={onEdit} style={styles.editButton}>
            <FontAwesome name="pencil" size={16} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.editButton}>
            <FontAwesome name="trash-o" size={16} color="#fff" />
          </TouchableOpacity>
              </>
            )
          }
        </View>
        )}
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    overflow:'hidden',
    backgroundColor: theme.colors.primary,
    marginHorizontal: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 15,
    marginTop: 8,
    borderRadius: 0,
    shadowColor: theme.colors.tertiary,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.fonts.fontTwo,
  },
  dateRow: {
    marginTop:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
    color: theme.fonts.fontSix,
  },
  expensesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  expenseText: {
    fontSize: 12,
    color: theme.fonts.fontSix,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completeTourButton: {
    backgroundColor: '#007218',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  completeTourButtonText: {
    fontSize: 12,
    color: theme.fonts.fontOne,
    fontWeight: 'bold',
  },
  editButton: {
    marginLeft: 10, 
    backgroundColor: theme.colors.tertiary, 
    borderRadius: 5,
    padding: 5, 
  },
});

export default TourListCard;
