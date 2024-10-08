import React, {useState,useEffect} from 'react';
import styles from './OtherExpenseScreenStyle';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import ExpenseHeader  from '../../../components/Header/ExpenseHeader';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import LocalListCard from '../../../components/ExpensePageComponents/LocalListCard';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { EXPENSE_BASE_URL, OTHER_EXPENSELIST_API, EXPENSE_TOKEN, OTHER_EXPENSE_DETAILS_API, OTHER_EXPENSE_DELETE_API, DOCUMENT_TOKEN_API, DOCUMENT_BEARER_TOKEN, LIMIT } from '@env';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import LoadMoreButton from '../../../components/ExpensePageComponents/LoadMoreButton';

const OtherExpenseScreen = ({ navigation }) => {

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
      const response=await axios.post(`${EXPENSE_BASE_URL}${OTHER_EXPENSELIST_API}`,{
          token: EXPENSE_TOKEN,
          employee_id:user_code,
          offset: parseInt(newOffset),
          limit: parseInt(limit)
      },{
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      })

      if (append) {
        setData(prevData => [...prevData, ...response.data.ExpensesList]);
      } else {
        setData(response.data.ExpensesList);
      }

      setOffset(Number(newOffset) + Number(limit));
      setHasMore(response.data.hasMore); 
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]); // Set data to an empty array in case of error
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch data for the default selected tab when the screen loads
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
const fetchExpenseDetails = async (other_id) => {
  try {

      const response = await axios.post(`${EXPENSE_BASE_URL}${OTHER_EXPENSE_DETAILS_API}`, {
          token: EXPENSE_TOKEN,
          other_id
      }, {
          headers: { 
              'Content-Type': 'application/x-www-form-urlencoded'
          },
      });

     
      return response.data.formattedexpense;
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
      console.log("Document Token:", documentToken);
      return documentToken;
  } catch (error) {
      console.error("Error fetching document token:", error);
      throw error; // Re-throw the error to be handled in the calling function
  }
};

const viewHandler = async (other_id) => {
  setLoading(true);

  try {
      const conveyanceDetails = await fetchExpenseDetails(other_id);
      const documentToken = await fetchDocumentToken();

      if (conveyanceDetails) {
          const documents = conveyanceDetails.otherUploads || [];
          console.log(documents);

          const params = {
              expense_id:conveyanceDetails.DrishteeExpense.expense_id,
              date: String(conveyanceDetails.other_expense_date),
              status: String(conveyanceDetails.DrishteeExpense.status),
              amount: String(conveyanceDetails.amount),
              expenseType: String(conveyanceDetails.expense_type),
              remarks: String(conveyanceDetails.remarks),
              billIssuedBy: conveyanceDetails.bill_issue_by ? String(conveyanceDetails.bill_issue_by) : '-',
              advanceRequired: String(conveyanceDetails.advance_required),
              gstApplicable: String(conveyanceDetails.gst_applicable),
              documentAttach: String(conveyanceDetails.documents_attach),
              ConveyanceDocuments: documents, // Pass the documents array
              documentToken: documentToken
          };

          navigation.navigate('ViewExpense', { ...params });
      }
  } catch (error) {
      setData([]); // Set data to an empty array in case of error
  } finally {
      setLoading(false);
  }
};

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

const deleteHandler= async(other_id) => {

  const userConfirmed = await showDeleteConfirmation();

  if (userConfirmed) {
    try {
      setLoading(true);
      
      const response = await axios.post(`${EXPENSE_BASE_URL}${OTHER_EXPENSE_DELETE_API}`, {
        token: EXPENSE_TOKEN,
        other_id
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
      setData([]); // Set data to an empty array in case of error
    } finally {
      setLoading(false);
    }
  } else {
      console.log("Deletion cancelled by the user.");
  }
  

}

const editHandler= async (other_id)=> {
  setLoading(true);

try {
    const conveyanceDetails = await fetchExpenseDetails(other_id);
    const documentToken = await fetchDocumentToken();

    if (conveyanceDetails) {
        const documents = conveyanceDetails.otherUploads || [];
        console.log(documents);
        // route.params?.totalBillAmount || route.params?.expenseType || route.params?.billDate || route.params?.documents || route.params?.remarks;
        const params = {
          totalBillAmount:String(conveyanceDetails.amount),
          expenseType:String(conveyanceDetails.expense_type),
          billDate:String(conveyanceDetails.other_expense_date),
          remarks:String(conveyanceDetails.remarks),
          documents:documents,
          documentToken: documentToken,
          other_id
        };

        navigation.navigate('OtherExpenseForm', { ...params });
    }
} catch (error) {
    setData([]); // Set data to an empty array in case of error
} finally {
    setLoading(false);
}

}

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#020242'}}>
    <View style={styles.maincontainer}>
      <ExpenseHeader 
                title="Other Expenses" 
                onPress={() => navigation.goBack()}
                showBackArrow={true} />
    <ScrollView style={styles.container}>
     
      
     <Text style={styles.expensesList}>Expense List</Text>
     <Text style={styles.expensesListdesc}>All Other expenses are listed below</Text>


      <View style={styles.contentContainer}>
        {loading && !data?.length ? (
          <ActivityIndicator size="large" color="#FFCC00" />
        ) : data?.length > 0 ? (
          <>
            {data?.map((item, index) => (
              <LocalListCard
                key={index}
                expense_id={item.expense_id}
                conveyance_date={item.other_expense_date}
                total_amount={item.amount}
                status={item.status}
                onClarification={() =>  viewHandler(item.other_id)}
                onEdit={() =>{
                  editHandler(item.other_id)
                }}
                onView={()=>{
                  viewHandler(item.other_id)
                }}
                onDelete={()=>{
                  deleteHandler(item.other_id)
                }}
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

     
    </ScrollView>
    <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('OtherExpenseForm')}>
  <Icon name="add" style={styles.fabIcon} />
</TouchableOpacity>
   </View>
   </SafeAreaView>
  );
};



export default OtherExpenseScreen;
