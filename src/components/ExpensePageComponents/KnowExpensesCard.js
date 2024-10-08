import React from "react";
import { View, Text, Image,Platform, StyleSheet, TouchableOpacity } from "react-native";
import theme from '../../utils/theme';

const KnowExpensesCard = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={[styles.button]}>
        <Image source={require("../../assets/Expense/rupee-sign.png")} style={[styles.image]} />
      <View style={styles.textcontainer}>
        <Text style={[styles.text  ]}>Know Your Expenses</Text>
        <Text style={[styles.text2  ]}>Check and Filter out all your expenses here</Text>

        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width:"100%",
    alignItems: "center",
    overflow:"hidden",
    paddingBottom :30,
    paddingTop: 0,

  },
  textcontainer:{
        flexDirection: 'column',    
        flexShrink: 1,
        width: '100%',  
paddingLeft:20,
        width:"100%",
        justifyContent: "space-between",
  },
  button: {
    padding:20,
    height: 120,
    width:"85%",
    backgroundColor:"#020242",
    flexDirection: 'row',    

    borderTopEndRadius:20,
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
    ...Platform.select({
      ios: {
        shadowColor: '#5791b3',      // Blue shadow color
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 20,
        shadowRadius: 20,
        shadowOpacity: 0.1,
        shadowColor: theme.colors.tertiary,
      },
    }),
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    // elevation:10,

  },
  image: {
    width: 70,
    height: 70,
  
  },
  text: {
    fontSize: 10,
    fontWeight:"bold",
    width: '100%',  

    width:"100%",
    color:"#fff",
  },
  text2: {
    fontSize: 10,
    paddingTop:10,
    fontWeight:"300",
    width: '100%',  

    width:"100%",
    color:"#ddd",
  },
});

export default KnowExpensesCard;
