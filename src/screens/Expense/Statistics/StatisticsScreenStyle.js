import { StyleSheet, Platform } from "react-native";
import theme from '../../../utils/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: '#fff',
  },
  expensesHeader: {
    width: '100%',
    backgroundColor: '#020242',
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",  // Positions headerLeft on left and headerRight on right
    alignItems: "center",
    zIndex: 1, // Ensures dropdown is visible above other components
  },
  
  tabContainer: {
    flex:1,
    flexDirection: "row",
    flexWrap:"wrap",
    justifyContent: "center",
    marginHorizontal:10,
    backgroundColor: theme.colors.primary,
    marginBottom: 10,
    marginTop:10,
  },
  
  tabItem: {
    height: 40,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    marginVertical:5,
    borderRadius: 30,
    borderWidth: 1,
    alignItems:'center',
    justifyContent:'center',
    borderColor:theme.colors.borderThree,
  },
  
 
  activeTabItem: {
    backgroundColor: theme.colors.backgroundFour,
    borderColor: theme.colors.secondary,
  },
  tabText: {
    fontSize:12,
    color: theme.fonts.fontThree,
  },
  activeTabText: {
    color:theme.colors.secondary,
    fontSize:12,
    fontWeight: '600',
  },
  expensesList: {
    color: theme.fonts.fontTwo,
    fontSize: 16,
    fontWeight: "800",
    marginHorizontal:20,
    marginVertical:10
  },
  expensesListdesc: {

    color: theme.fonts.fontFour,
    fontSize: 13,
    fontStyle:'italic',
    fontWeight: "300",
    marginTop:10,
    marginHorizontal:20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {

    zIndex: 999, // Ensures dropdown is displayed on top
  },
  pieContainer:{
    paddingTop:20,
    borderRadius :20,
    margin:30,
    padding:10,
    backgroundColor: theme.colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.shadowOne,      // Blue shadow color
        shadowOffset: { width: 0, height: 3 }, // Offset for shadow
        shadowOpacity: 0.6,          // Opacity of the shadow
        shadowRadius: 6,             // Blur radius of the shadow
      },
      android: {
        elevation: 10 ,               // Android shadow (elevation)
        shadowColor: theme.colors.shadowOne,      
      },
    }),
  },
  backarrow: {
    marginLeft:10,
    height: 20,
    width: 20,
    marginRight: 10,
    tintColor: "#aaa",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
  },
  maincontainer: {
    height: "100%",
    backgroundColor: '#fff',
  },
  tableContainer: {
    marginBottom: 20,
    padding:15,
    zIndex: -1000,
  },
  head: {
    height: 60,
    backgroundColor: "#020242",
  },
  headerText: {
    margin: 6,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    height: 60,
    
  },
  text: {
    margin: 6,
    fontSize:14,
    color: "#020242",
    textAlign: "center",
  },
});

export default styles;
