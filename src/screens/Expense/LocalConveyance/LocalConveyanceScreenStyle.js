import { StyleSheet } from "react-native";
import theme from "../../../utils/theme";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      height:"100%",
      backgroundColor: theme.colors.primary,
    },
    maincontainer:{
      height:"100%",
      backgroundColor: theme.colors.secondary,
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'center', 
      paddingVertical: 10,
    },
    expensesList: {
      color: theme.fonts.fontTwo,
      fontSize: 16,
      fontWeight: "800",
      marginHorizontal:20,
      marginVertical:10
    },
    expensesListdesc: {
      color: '#666',
      fontSize: 13,
      fontStyle:'italic',
      fontWeight: "300",
      marginBottom:5,
      marginHorizontal:20,
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyStateImage: {
      width: 200,
      height: 200,
      resizeMode: 'contain',
    },
    noDataText: {
      color: theme.fonts.fontTwo,
      fontSize: 16,
    },
    fab: {
      position: 'absolute',
      backgroundColor: theme.colors.secondary,
      width: 50,
      height: 50,
      borderRadius: 30,
      justifyContent: 'center', 
      alignItems: 'center',     
      bottom: 20, 
      right: 20, 
    },
    fabIcon: {
      fontSize: 40,
      color: theme.colors.primary,
    },
  
  });

export default styles;
