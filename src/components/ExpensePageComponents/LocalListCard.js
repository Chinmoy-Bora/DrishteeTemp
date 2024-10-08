import React from 'react';
import { View, Text,Image,  TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import theme from '../../utils/theme';

const LocalListCard = ({ expense_id, conveyance_date, status, total_amount, expenseTitle, onClarification, onEdit, onView, onDelete }) => {
  const navigation = useNavigation();

  const getStyle = () => {
    switch (status) {
      case 'Approved':
        return styles.approved;
      case 'Rejected':
        return styles.rejected;
      case 'In Progress':
        return styles.inProgress;
      default:
        return styles.inProgress;
    }


  };


  const statusStyle = getStyle();

  return (
    <View style={styles.cardContainer}>
     
         <View style={statusStyle}>
      
          <Text style={statusStyle}>{status}{expenseTitle && (
        <Text style={styles.titletext}>
           &nbsp; : &nbsp;{expenseTitle}
        </Text>
      )}</Text>
          
          <View style={styles.dateRow}>
            <View style={styles.dateR}>
              <FontAwesome name='calendar-o' size={13} color='#fff' /> 
              <Text  style={styles.dateText}>&nbsp;&nbsp;{conveyance_date}</Text>
            </View >
            <TouchableOpacity onPress={onView} style={styles.touchable} accessibilityLabel="View">
                  <Image source={require("../../assets/Expense/info.png")} style={styles.image}/>
            </TouchableOpacity> 
          </View>

        </View>
        <View style={styles.row1}>
        <View style={styles.rupeeRow}>
        <Text style={styles.amount}>₹{total_amount}</Text>

        </View>
        <Text style={styles.id}>ID : {expense_id}</Text>

    
        </View>

    
     
      

      <View style={styles.footerRow}>
        

        <View style={[styles.footerActions, status === 'Approved' && styles.moveEyeButton]}>
          

          {status !== 'Approved' && (
            <>
              <TouchableOpacity onPress={onEdit} style={styles.editButton} accessibilityLabel="Edit">
                {/* <FontAwesome name="edit" size={24} color="#020242" /> */}
                <Text style={styles.clarificationButtonText}>Edit</Text>

              </TouchableOpacity>
              <TouchableOpacity onPress={onDelete} style={styles.deleteButton} accessibilityLabel="onDelete">
                {/* <FontAwesome name="edit" size={24} color="#020242" /> */}
                <Text style={styles.clarificationButtonText}>Delete</Text>

              </TouchableOpacity>
            
            </>
          )}
        </View>
      </View>

{status == 'Rejected' && (
  <TouchableOpacity onPress={onClarification} style={styles.clarificationButton} accessibilityLabel="Clarification">
    <Text style={styles.clarificationButtonText}>Clarification</Text>
  </TouchableOpacity>
)}
</View> 
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: theme.colors.primary,
    marginHorizontal: 16,
    marginBottom: 20,
    marginTop: 8,
    borderBottomRightRadius:30,
    borderBottomLeftRadius:30,
    borderTopRightRadius:30,
    shadowColor: theme.colors.tertiary,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    overflow:'hidden',
    elevation: 5,
  },
  row1: {
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal:26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  id: {
    fontWeight: '600',
    fontSize: 10,
    color: '#787FA9',
    marginTop:10,
    width:'auto',
    paddingHorizontal:20,
    paddingVertical:5,
    borderRadius:15,
   backgroundColor:"#EBEEFC",

  },
  amount: {
    fontWeight: 'bold',
    fontSize: 26,
    paddingRight: 5,
    color: theme.fonts.fontTwo,
  },
  titletext:{
    fontSize:12,
color:theme.fonts.fontOne,
    paddingTop:10,
      fontStyle:'italic',
    paddingHorizontal:15,
    fontWeight:'300',
  
  },
  rupeeRow: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal:26,
  },
  dateText: {
    
    fontSize: 12,
    color:theme.fonts.fontOne,
    fontWeight: '600',

  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',  // Ensure vertical centering
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    fontSize: 14,
    color: theme.fonts.fontOne,
    fontWeight: '600',
    marginBottom: 10,
  },
  dateR: {
    flexDirection: 'row',
    alignItems: 'center',  
  },
  footerRow: {
    paddingHorizontal:26,
    paddingBottom:16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  approved: {

    backgroundColor: '#007218', // Green background
    paddingTop: 5,
    fontSize: 12,
    fontWeight: '400',
    color: '#caffc6',
    paddingHorizontal: 15,
  },
  rejected: {
    backgroundColor: '#bf0101', // Red background
    paddingTop: 5,
    fontSize: 12,
    fontWeight: '400',
    color: '#f7b7b7',
    paddingHorizontal: 15,
  },
  inProgress: {
    
    paddingTop: 5,
    fontSize: 12,
    fontWeight: '400',
   backgroundColor: '#000075', // Sky blue background
    color: '#91CAFF',
    paddingHorizontal: 15,
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moveEyeButton: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  clarificationButton: {
    backgroundColor: '#ff9d00',
    padding: 8,
    paddingHorizontal:22,
    alignContent:'center',
    alignItems:'center',
    borderRadius: 15,
    width:'auto',
    marginHorizontal:26,
    marginBottom:20,
  },
  editButton: {
    backgroundColor: '#006980',
    flex:2,
    alignContent:'center',
    alignItems:'center',
    borderRadius: 15,
    marginRight:10,
    paddingVertical: 6,
  },
  deleteButton: {
    flex:1,
    textAlign:'center',
    alignItems:'center',
    backgroundColor: theme.colors.colorOne,
    paddingHorizontal: 18,
    borderRadius: 15,
    paddingVertical: 6,
  },
  clarificationButtonText: {
    fontSize: 12,
    color: theme.fonts.fontOne,
    fontWeight: 'bold',
  },
  touchable: {
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  image:{
    height:20,
    width:20,
    tintColor:theme.colors.primary
  }
});

export default LocalListCard;
