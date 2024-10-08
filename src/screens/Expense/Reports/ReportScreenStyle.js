import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
    container: {
      backgroundColor: "#fff",
      padding: 20,
    },
    maincontainer: {
      flex: 1,
      backgroundColor: "#fff",
    },
    dropdownContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    dropdownWrapper: {
      flex: 1,
      marginRight: 10,
    },
    dropdown: {
      backgroundColor: "#f0f0f0",
      borderColor: "#020242",
      borderWidth: 1,
      borderRadius: 5,
      elevation: 3,
      
    },
    dropdownMenu: {
      backgroundColor: "#fff",
      borderColor: "#020242",

      
    },
    dropdownPlaceholder: {
      color: "#020242",
      fontSize: 14,
      fontWeight: "bold",
    },
    dropdownLabel: {
      fontSize: 14,
      color: "#020242",
      fontWeight: "bold",
    },
    filterContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginBottom: 20,
    },
    applyButton: {
      backgroundColor: "#020242",
      paddingVertical: 15,
      borderRadius: 5,
      marginBottom: 20,
      alignItems: "center",
    },
    applyButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 18,
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