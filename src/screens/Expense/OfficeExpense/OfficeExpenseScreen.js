import React, {useState} from "react";
import styles from "./OfficeExpenseScreenStyle";
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert, SafeAreaView } from "react-native";
import RectangleButton from "../../../components/ExpensePageComponents/RectangleButton";
import ExpenseHeader from "../../../components/Header/ExpenseHeader";
import LocalListCard from "../../../components/ExpensePageComponents/LocalListCard";
import { EXPENSE_BASE_URL,  OFFICE_EXPENSELIST_API, EXPENSE_TOKEN, OFFICE_EXPENSE_DETAILS_API, DOCUMENT_BEARER_TOKEN, DOCUMENT_TOKEN_API, OFFICE_EXPENSE_DELETE_API, LIMIT } from '@env';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import LoadMoreButton from "../../../components/ExpensePageComponents/LoadMoreButton";
import theme from "../../../utils/theme";

const OfficeExpenseScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true)

  const fetchData = async (newOffset = 0, append = false) => {
    setLoading(true);

    try {
       const limit=LIMIT;
        const userData = await SecureStore.getItemAsync('DrishteeuserData');
        const { user_code } = JSON.parse(userData);
        console.log("Limit and Offset",newOffset,limit)
        const response = await axios.post(
            `${EXPENSE_BASE_URL}${OFFICE_EXPENSELIST_API}`,
            {
                token: EXPENSE_TOKEN,
                employee_id: user_code,
                offset: parseInt(newOffset),
                limit: parseInt(limit)
            },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            }
        );
        console.log("Expense List:",response.data)
        if (append) {
          setData(prevData => [...prevData, ...response.data.ExpensesList]);
        } else {
          setData(response.data.ExpensesList);
        }

        
        setOffset(Number(newOffset) + Number(limit));
        setHasMore(response.data.hasMore); 
    } catch (error) {
        console.error("Error fetching data:", error);
        setData([]); 
    } finally {
        setLoading(false);
    }
};

useFocusEffect(
  useCallback(() => {
      setOffset(0);
      fetchData(0, false); 
  }, [])
);

const loadMoreData = () => {
  if (hasMore && !loading) { 
      fetchData(offset, true); 
  }
};

const fetchExpenseDetails = async (officeExpense_id) => {
  try {
    console.log(`${EXPENSE_BASE_URL}${OFFICE_EXPENSE_DETAILS_API}`,{
      token: EXPENSE_TOKEN,
      office_expense_id: officeExpense_id
  })
      const response = await axios.post(`${EXPENSE_BASE_URL}${OFFICE_EXPENSE_DETAILS_API}`, {
          token: EXPENSE_TOKEN,
          office_expense_id: officeExpense_id
      }, {
          headers: { 
              'Content-Type': 'application/x-www-form-urlencoded'
          },
      });

      
      return response.data.formattedofficeexpense;
  } catch (error) {
      console.error("Error fetching expense details:", error);
      throw error; 
  }
};
const fetchDocumentToken = async () => {
  try {
      const imageResponse = await axios.get(`${DOCUMENT_TOKEN_API}`, {
          headers: {
              Authorization: `Bearer ${DOCUMENT_BEARER_TOKEN}`,
          },
      });

      const documentToken = imageResponse.data.data.token;
      
      return documentToken;
  } catch (error) {
      console.error("Error fetching document token:", error);
      throw error; // Re-throw the error to be handled in the calling function
  }
};

const viewHandler = async (officeExpense_id) => {
  try {
    setLoading(true);

    const conveyanceDetails = await fetchExpenseDetails(officeExpense_id);
    const documentToken = await fetchDocumentToken();
    
    if (conveyanceDetails) {
      
      const documents = conveyanceDetails.officeUploads || [];

      const params = {
        expense_id:conveyanceDetails.DrishteeExpense.expense_id,
        date: String(conveyanceDetails.office_expense_date),
        status: String(conveyanceDetails.DrishteeExpense.status),
        category: String(conveyanceDetails.DrishteeExpense.expense_title),
        amount: String(conveyanceDetails.expense_amount), 
        documentAttach: String(conveyanceDetails.documents_attach),
        description:String(conveyanceDetails.description),
        ConveyanceDocuments: documents, // Pass the documents array
        dueDate:conveyanceDetails.DrishteeExpense.expense_title==="Rent Expenses" && String(conveyanceDetails.due_date),
        officeLocation: conveyanceDetails.DrishteeExpense.expense_title==="Rent Expenses" && String(conveyanceDetails.office_location),
        officeOwner: conveyanceDetails.DrishteeExpense.expense_title==="Rent Expenses" && String(conveyanceDetails.office_owner),
        expenseType: conveyanceDetails.DrishteeExpense.expense_title==="Other Expenses" && String(conveyanceDetails.other_expense),
        documentToken: documentToken
      };

      navigation.navigate('ViewExpense', { ...params });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    setData([]); // Set data to an empty array in case of error
  } finally {
    setLoading(false);
  }
};

const editHandler= async( officeExpense_id) => {
  setLoading(true);
  try {
    const conveyanceDetails = await fetchExpenseDetails(officeExpense_id);
    const documentToken = await fetchDocumentToken();

    if (conveyanceDetails && (conveyanceDetails.DrishteeExpense.expense_title==="Rent Expenses")) {
        const documents = conveyanceDetails.officeUploads || [];
       
        
        const params = {
          totalBillAmount:conveyanceDetails.expense_amount,
          billDate:String(conveyanceDetails.office_expense_date),
          remarks:conveyanceDetails.description,
          officeLocation:conveyanceDetails.office_location,
          officeOwner:conveyanceDetails.office_owner,
          dueDate:String(conveyanceDetails.due_date),
          documents:documents,
          documentToken: documentToken,
          officeExpense_id
        };
        navigation.navigate("OffieExpenseForm", {
          ...params,
          headerTitle: "Rent Expenses",
          fieldsToShow: ["officeLocation", "billDate", "officeOwner","remarks", "dueDate","totalBillAmount", "uploadedFiles"],
          requiredFields: ["officeLocation", "billDate", "officeOwner","remarks", "dueDate","totalBillAmount"],
        })
    }else if (conveyanceDetails && (conveyanceDetails.DrishteeExpense.expense_title==="Other Expenses")) {
      const documents = conveyanceDetails.officeUploads || [];
     
      
      const params = {
        totalBillAmount:conveyanceDetails.expense_amount,
        billDate:String(conveyanceDetails.office_expense_date),
        remarks:conveyanceDetails.description,
        expenseType:conveyanceDetails.other_expense,
        documents:documents,
        documentToken: documentToken,
        officeExpense_id
      };
      navigation.navigate("OffieExpenseForm", {
        ...params,
        headerTitle: "Other Expenses",
        fieldsToShow: [ "expenseType","billDate", "remarks","totalBillAmount", "uploadedFiles"],
        requiredFields: ["expenseType","billDate", "remarks","totalBillAmount", "uploadedFiles"],
      })
    } else if (conveyanceDetails){
      const documents = conveyanceDetails.officeUploads || [];
     
      
      const params = {
        totalBillAmount:conveyanceDetails.expense_amount,
        billDate:String(conveyanceDetails.office_expense_date),
        remarks:conveyanceDetails.description,
        documents:documents,
        documentToken: documentToken,
        officeExpense_id
      };
      navigation.navigate("OffieExpenseForm", {
        ...params,
        headerTitle: conveyanceDetails.DrishteeExpense.expense_title,
        fieldsToShow: [ "billDate", "remarks","totalBillAmount", "uploadedFiles"],
        requiredFields: ["billDate", "remarks","totalBillAmount", "uploadedFiles"],
      })

    }
} catch (error) {
    setData([]);
} finally {
    setLoading(false);
}

}
const showDeleteConfirmation = () => {
  return new Promise((resolve) => {
      Alert.alert(
          "Confirm Deletion",
          "Are you sure you want to delete this expense?",
          [
              {
                  text: "Cancel",
                  onPress: () => resolve(false), // User chose to cancel
                  style: "cancel"
              },
              {
                  text: "Delete",
                  onPress: () => resolve(true), 
              }
          ],
          { cancelable: false } 
      );
  });
};

const deleteHandler = async (officeExpense_id) => {

  const userConfirmed = await showDeleteConfirmation();

  if (userConfirmed) {
    try {
      setLoading(true);
      
      const response = await axios.post(`${EXPENSE_BASE_URL}${OFFICE_EXPENSE_DELETE_API}`, {
        token: EXPENSE_TOKEN,
        office_expense_id:officeExpense_id
      }, {
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      });
      console.log(response.data)
      fetchData();
      setLoading(false);
      Alert.alert("Deletion", "Expense deleted successfully.");
      

    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  } else {
      console.log("Deletion cancelled by the user.");
  }

}

  return (
    <SafeAreaView style={{flex:1,backgroundColor:theme.colors.headerColor}}>
    <View style={styles.container}>
      <ExpenseHeader
      title="Office Expenses" 
      onPress={() => navigation.goBack()}
      showBackArrow={true} 
    />
      <ScrollView>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Expenses Type</Text>

        <View style={styles.buttonBox}>
          <RectangleButton
            imageSource={require("../../../assets/Expense/ElectricityExp.png")}
            text="Electricity Bill"
            backgroundColor="#fff"
            tintColor="#020242"
            onPress={() => navigation.navigate("OffieExpenseForm", {
                headerTitle: "Electricity Bill",
                fieldsToShow: [ "billDate", "remarks", "totalBillAmount", "uploadedFiles"],
                requiredFields: ["billDate", "remarks", "totalBillAmount", "uploadedFiles"],
              })}
          />
          <RectangleButton
            imageSource={require("../../../assets/Expense/rent.png")}
            text="Rent Expenses"
            backgroundColor="#fff"
            tintColor="#020242"

            onPress={() => navigation.navigate("OffieExpenseForm", {
                headerTitle: "Rent Expenses",
                fieldsToShow: ["officeLocation", "billDate", "officeOwner","remarks", "dueDate","totalBillAmount", "uploadedFiles"],
                requiredFields: ["officeLocation", "billDate", "officeOwner","remarks", "dueDate","totalBillAmount"],
              })}
          />
          <RectangleButton
            imageSource={require("../../../assets/Expense/StaffExp.png")}
            text="Staff welfare"
            backgroundColor="#fff"
            tintColor="#020242"

            onPress={() => navigation.navigate("OffieExpenseForm", {
                headerTitle: "Staff Welfare",
                fieldsToShow: [ "billDate", "remarks","totalBillAmount", "uploadedFiles"],
                requiredFields: ["billDate", "remarks","totalBillAmount", "uploadedFiles"],
              })}
              
          />
        
          <RectangleButton
            imageSource={require("../../../assets/Expense/repairing.png")}
            text="Repairing/Maintenance"
            backgroundColor="#fff"
            tintColor="#020242"

            onPress={() => navigation.navigate("OffieExpenseForm", {
                headerTitle: "Repair/Maintenance",
                fieldsToShow: [ "billDate", "remarks","totalBillAmount", "uploadedFiles"],
                requiredFields: ["billDate", "remarks","totalBillAmount", "uploadedFiles"],
              })}
            
          />
          <RectangleButton
            imageSource={require("../../../assets/Expense/stationary.png")}
            text="Stationary"
            backgroundColor="#fff"
            tintColor="#020242"

            onPress={() => navigation.navigate("OffieExpenseForm", {
                headerTitle: "Stationary",
                fieldsToShow: [ "billDate", "remarks","totalBillAmount", "uploadedFiles"],
                requiredFields: ["billDate", "remarks","totalBillAmount", "uploadedFiles"],
              })}
          />
          <RectangleButton
            imageSource={require("../../../assets/Expense/report.png")}
            text="Other"
            backgroundColor="#fff"
            tintColor="#020242"

            onPress={() => navigation.navigate("OffieExpenseForm", {
                headerTitle: "Other Expenses",
                fieldsToShow: [ "expenseType","billDate", "remarks","totalBillAmount", "uploadedFiles"],
                requiredFields: ["expenseType","billDate", "remarks","totalBillAmount", "uploadedFiles"],
              })}
          />
        </View>

        <Text style={styles.expensesList}>Expenses list</Text>

        <View style={styles.contentContainer}>
      {loading && !data?.length ? (
        <ActivityIndicator size="large" color="#FFCC00" />
      ) : data?.length > 0 ? (
        <>
          {data?.map((item, index) => (
            <LocalListCard
              key={index}
              expense_id={item.office_expense_id}
              conveyance_date={item.office_expense_date}
              total_amount={item.expense_amount}
              status={item.status}
              expenseTitle={item.expense_type}
              onClarification={() => viewHandler(item.office_expense_id)}
              onView={() => viewHandler(item.office_expense_id)}
              onEdit={() => editHandler(item.office_expense_id)}
              onDelete={() => deleteHandler(item.office_expense_id)}
            />
          ))}
          {hasMore && (
            <LoadMoreButton onPress={loadMoreData} />
          )}
        </>
      ) : (
        <View style={styles.emptyStateContainer}>
          <Image source={require('../../../assets/nodata.png')} style={styles.emptyStateImage} />
          <Text style={styles.noDataText}>No data available</Text>
        </View>
      )}
    </View>
      </View>

      
      </ScrollView>
    </View>
    </SafeAreaView>
  );
};

export default OfficeExpenseScreen;
