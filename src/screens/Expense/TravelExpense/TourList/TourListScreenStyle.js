import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      backgroundColor: '#020242',
      paddingVertical: 15,
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff',
      marginLeft: 10,

    },
    expensesList: {
      color: '#000',
      fontSize: 16,
      fontWeight:'bold',
      marginVertical: 10,
      marginLeft: 20,
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
      color: '#000',
      fontSize: 16,
    },
    content: {
        padding: 20,
        marginBottom:-20
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
        textAlign: "left",
        marginBottom: 10,
    },

    buttonBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 10,
        padding: 10,
        backgroundColor: "#1C1C1C",
        overflow: "hidden",
        width: '100%',
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly", 
        alignItems: "center",
        width: '100%',
        paddingHorizontal: 10, 
        marginBottom: 15,
},
contentContainer: {
  flex: 1,
  justifyContent: 'center', // Center vertically
  paddingHorizontal: 20,
  paddingVertical: 10,
},
loadMoreContainer:{
  alignItems: 'center',
  marginVertical: 10,
  
},
loadMoreButton: {
  padding: 10,
  backgroundColor: '#020242',
  justifyContent:'center',
  alignItems: 'center',
  borderRadius: 50,
  width:120
  
},
loadMoreText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
  backgroundColor:'#020242'
},
  });

export default styles;
