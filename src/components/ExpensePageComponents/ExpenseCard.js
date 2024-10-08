import React from 'react';
import { View, Text,Image, StyleSheet } from 'react-native';
import theme from '../../utils/theme';

const ExpenseCard = ({ color, title, travelAmount, localConveyanceAmount, otherAmount }) => {
  return (
    <View style={[styles.expenseBox]}>
              <View style={styles.expensetitlebox}>

      <Text style={[styles.expenseBoxTitle]}>{title}</Text>
      </View>
      <View style={styles.expenseBoxRow}>
        <Text style={styles.expenseText}>Travel</Text>
        <Text style={styles.expenseAmount}>₹ {travelAmount}</Text>
      </View>
      <View style={styles.expenseBoxRow}>
        <Text style={styles.expenseText}>Local Conveyance</Text>
        <Text style={styles.expenseAmount}>₹ {localConveyanceAmount}</Text>
      </View>
      <View style={styles.expenseBoxRow}>
        <Text style={styles.expenseText}>Other</Text>
        <Text style={styles.expenseAmount}>₹ {otherAmount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  expenseBox: {
    backgroundColor:'#fff',
    padding: 20,
    borderBottomRightRadius:30,
    borderBottomLeftRadius:30,
    borderTopRightRadius:30,    margin: 15,
    shadowColor: theme.colors.tertiary,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 20,
    elevation: 20,
  },
  expenseBoxTitle: {
    fontSize: 14,
    color:'#000',
    fontWeight: 'bold',
  },
  expensetitlebox:{
flexDirection:'row',
alignContent:'center',
alignItems:"center",
justifyContent:'flex-start',
marginBottom: 10,

  },
  expenseBoxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  expenseText: {
    fontWeight:'600',
    fontSize: 12,
    color: theme.fonts.fontFour,
  },
  image: {
    width: 18,
    height: 18,
  alignContent:"center",
  },
  expenseAmount: {
    fontSize: 12,
    fontWeight:'600',

    color: theme.fonts.fontTwo,
  },
});

export default ExpenseCard;
