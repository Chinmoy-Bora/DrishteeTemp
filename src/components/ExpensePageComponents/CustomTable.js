import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const headerWidths = [
    screenWidth * 0.27,
    screenWidth * 0.25,
    screenWidth * 0.3,
    screenWidth * 0.15,
    screenWidth * 0.25,
];

const CustomTable = ({ data, tableHead, handleRowClick, isSliceClicked, filteredData }) => {
  return (
    <View style={styles.tableContainer}>
      <ScrollView horizontal>
        <View style={styles.tableWrapper}>
          {/* Table Header */}
          <View style={styles.head}>
            {tableHead.map((headerItem, index) => (
              <View key={index} style={[styles.headerCell, { width: headerWidths[index] }]}>
                <Text style={styles.headerText}>{headerItem}</Text>
              </View>
            ))}
          </View>
          
          {/* Table Body */}
          {isSliceClicked ? (
            filteredData?.length > 0 ? (
              filteredData.map((rowData, index) => (
                <TouchableOpacity key={index} onPress={() => handleRowClick(rowData)}>
                  <View style={styles.row}>
                    <Text style={[styles.cell, { width: screenWidth * 0.27 }]}>{rowData.expense_date}</Text>
                    <Text style={[styles.cell, { width: screenWidth * 0.25 }]}>{rowData.expense_type}</Text>
                    <Text style={[styles.cell, { width: screenWidth * 0.3 }]}>
                      {rowData.expense_category === "null" ? "-" : rowData.expense_category || "N/A"}
                    </Text>
                    <Text style={[styles.cell, { width: screenWidth * 0.15 }]}>{`₹${rowData.expense_amount}`}</Text>
                    <Text style={[styles.cell, { width: screenWidth * 0.25 }]}>{rowData.status}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.row}>
                <Text style={[styles.cell, { width: screenWidth }]}>No data available</Text>
              </View>
            )
          ) : data?.length > 0 ? (
            data.map((rowData, index) => (
              <TouchableOpacity key={index} onPress={() => handleRowClick(rowData)}>
                <View style={styles.row}>
                  <Text style={[styles.cell, { width: screenWidth * 0.27 }]}>{rowData.expense_date}</Text>
                  <Text style={[styles.cell, { width: screenWidth * 0.25 }]}>{rowData.expense_type}</Text>
                  <Text style={[styles.cell, { width: screenWidth * 0.3 }]}>
                    {rowData.expense_category === "null" ? "-" : rowData.expense_category || "N/A"}
                  </Text>
                  <Text style={[styles.cell, { width: screenWidth * 0.15 }]}>{`₹${rowData.expense_amount}`}</Text>
                  <Text style={[styles.cell, { width: screenWidth * 0.25 }]}>{rowData.status}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.row}>
              <Text style={[styles.cell, { width: screenWidth }]}>No data available</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = {
  tableContainer: {
    margin: 20,
    borderRadius: 10,
    backgroundColor: '#f4f4f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 5,
  },
  tableWrapper: {
    borderRadius: 10, // Add border radius to the entire table
  },
  head: {
    flexDirection: "row",
    backgroundColor: "#ddd",
    borderTopLeftRadius: 10, // Add corner radius to the top left corner
    borderTopRightRadius: 10, // Add corner radius to the top right corner
    overflow: "hidden", // Clip content to ensure radius takes effect
  },
  headerCell: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  headerText: {
    fontWeight: "600", // Bold the text for a designable style
    fontSize: 12,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    fontSize: 12,
    color: "#020242",
    textAlign: "center",
  },
};

export default CustomTable;
