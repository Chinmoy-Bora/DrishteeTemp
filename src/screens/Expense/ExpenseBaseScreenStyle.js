import { StyleSheet , Platform} from "react-native";
import theme from "../../utils/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:theme.colors.primary,
    
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 0, 
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 15,
    backgroundColor: theme.colors.secondary, //333448
    elevation: 15,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight:"bold",
    color: theme.fonts.fontOne,
    textAlign: "let",
    flex: 1,

  },
  iconback: {
    width: 25,
    height: 25,
    marginLeft:10,
    resizeMode: 'contain', 

  },
  iconinfo: {
    width: 25,
    height: 25,
    marginRight:10,
    resizeMode: 'contain', 
  },
  content: {
  },
  section: {
    padding: 20,

    marginBottom: 0,
  },
  
  sectionTitle: {
    fontWeight:"800",
    fontSize: 18,
    color: theme.fonts.fontTwo,
    textAlign: "left",
    marginBottom: 10,
  },
  sectionsubTitle: {
    fontWeight:"400",
    fontSize: 11,
    color: theme.fonts.fontTwo,
    textAlign: "left",
    marginBottom: 10,
  },
  image: {
    width: 25,
    height: 25,
    tintColor: theme.colors.primary,
  
  },
  buttonBox: {
    flexDirection: "row",
    flexWrap:"wrap",
    
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop:15,
    paddingTop:20,
    borderRadius: 10,
    padding: 10,
    marginBottom:2,
    overflow : "hidden",
    backgroundColor: theme.colors.primary,
      ...Platform.select({
      ios: {
        shadowColor: theme.colors.shadowOne,      // Blue shadow color
        shadowOffset: { width: 0, height: 3 }, // Offset for shadow
        shadowOpacity: 0.6,          // Opacity of the shadow
        shadowRadius: 6,             // Blur radius of the shadow
      },
      android: {
        shadowColor: theme.colors.shadowOne,      
      },

    }),
  },
    buttonBox1: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,


     
    },
  
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    justifyContent:'space-between'
  },
  expensesContainer: {  
    width:"100%",
    borderColor: "#2A5CA9",//2A5CA9
    borderRadius :20,
    borderWidth:0.3,
    backgroundColor: theme.colors.primary,//2A4B81
    marginTop: 10,  
    paddingBottom: 100,  

    ...Platform.select({
      ios: {
        shadowColor: '#036BB9', // Shadow color
        shadowOffset: { width: 0, height: -10 }, // Negative height for top shadow
        shadowOpacity: 0.6,      // Shadow opacity
        shadowRadius: 6,         // Blur radius for the shadow
      },
      android: {
        elevation: 20,          // Android shadow elevation
        shadowColor: '#036BB9', // Android shadow color (works with elevation)
        shadowOffset: { width: 0, height: -10 }, // Negative height for top shadow
        shadowOpacity: 1,        // Shadow opacity on Android (optional, for fine-tuning)
        shadowRadius: 20,        // Blur radius for Android shadow
      },
    }),
  },
  expensesHeader: {
    
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
  },
  expensesTitle: {
    fontSize: 14,
    paddingTop:10,
    paddingStart:8,
    fontWeight:"bold",
    color: theme.fonts.fontTwo,
  },
  expensesToday: {
    fontSize: 12,
    color: theme.colors.colorOne,
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
 


});

export default styles;
