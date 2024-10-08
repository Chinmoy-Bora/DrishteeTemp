import { StyleSheet, Platform } from "react-native";
import theme from "../../../utils/theme";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundThree,
    },
    header: {
      backgroundColor: theme.colors.backgroundTwo,
      paddingVertical: 15,
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    emptyStateContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primary
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
    content: {
        padding: 20,
        
        backgroundColor: theme.colors.primary
    },
    expensesList:{
      fontSize: 16,
        fontWeight: "bold",
        color: theme.fonts.fontTwo,
        textAlign: "left",
        
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: theme.fonts.fontTwo,
        textAlign: "left",
        marginBottom: 10,
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'center', // Center vertically
      paddingVertical: 10,
    },
    buttonBox: {
      flexDirection: "row",
      flexWrap:"wrap",
      marginBottom:10,
      justifyContent: "flex-start",
      alignItems: "center",
      paddingTop:20,
      borderRadius: 10,
      padding: 10,
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

    
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between", 
        alignItems: "center",
        width: '100%',
        paddingHorizontal: 20, 
        marginBottom: 30,
},

  });

export default styles;
