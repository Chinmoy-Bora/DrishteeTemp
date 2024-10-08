import React, {useState,useEffect} from 'react';
import styles from './LocalConveyanceScreenStyle';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import ExpenseHeader  from '../../../components/Header/ExpenseHeader';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import LocalListCard from '../../../components/ExpensePageComponents/LocalListCard';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { EXPENSE_BASE_URL,  LOCAL_EXPENSELIST_API, EXPENSE_TOKEN, LOCAL_EXPENSE_DETAILS_API, DOCUMENT_BEARER_TOKEN, DOCUMENT_TOKEN_API, LOCAL_EXPENSE_DELETE_API, LIMIT } from '@env';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import LoadMoreButton from '../../../components/ExpensePageComponents/LoadMoreButton';
import theme from '../../../utils/theme';

const LocalConveyanceScreen = ({ navigation }) => {

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
            `${EXPENSE_BASE_URL}${LOCAL_EXPENSELIST_API}`,
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

  const fetchExpenseDetails = async (conveyance_id) => {
    try {
        const response = await axios.post(`${EXPENSE_BASE_URL}${LOCAL_EXPENSE_DETAILS_API}`, {
            token: EXPENSE_TOKEN,
            local_conveyance_id: conveyance_id
        }, {
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        });
  
        
        return response.data.formattedConveyance;
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

  const viewHandler = async (conveyance_id) => {
    try {
      setLoading(true);
  
      const conveyanceDetails = await fetchExpenseDetails(conveyance_id);
      const documentToken = await fetchDocumentToken();
      
      if (conveyanceDetails) {
        
        const documents = conveyanceDetails.conveyanceUploads || [];
  console.log("Data112",conveyanceDetails)
        const params = {
          expense_id:conveyanceDetails.DrishteeExpense.expense_id,
          date: String(conveyanceDetails.conveyance_date),
          status: String(conveyanceDetails.DrishteeExpense.status),
          category: String(conveyanceDetails.DrishteeExpense.expense_title),
          amount: String(conveyanceDetails.total_amount),
          billIssuedBy: conveyanceDetails.bill_issue_by ? String(conveyanceDetails.bill_issue_by) : '-',
          advanceRequired: String(conveyanceDetails.advance_required),
          gstApplicable: String(conveyanceDetails.gst_applicable),
          documentAttach: String(conveyanceDetails.documents_attach),
          location: String(conveyanceDetails.location_name),
          department: String(conveyanceDetails.department_name),
          project: String(conveyanceDetails.project_name),
          fromLocation: String(conveyanceDetails.from_location),
          toLocation: String(conveyanceDetails.to_location),
          km: String(conveyanceDetails.distance_in_km),
          transportMode:String(conveyanceDetails.transport_mode_name),
          transportationType: String(conveyanceDetails.transportation_type),
          ratePerKm: String(conveyanceDetails.rate_per_km),
          gstAmount: String(conveyanceDetails.gst_amount),
          withoutGstAmount: String(conveyanceDetails.without_gst_amount),
          purposeOfVisit:String(conveyanceDetails.visit_purpose),
          ConveyanceDocuments: documents, // Pass the documents array
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

  const editHandler= async( conveyance_id) => {
    setLoading(true);
    try {
      const conveyanceDetails = await fetchExpenseDetails(conveyance_id);
      const documentToken = await fetchDocumentToken();
  
      if (conveyanceDetails) {
          const documents = conveyanceDetails.conveyanceUploads || [];
         
          
          const params = {
            totalBillAmount:conveyanceDetails.total_amount,
            billDate:conveyanceDetails.conveyance_date,
            remarks:conveyanceDetails.visit_purpose,
            modeOfTransport:conveyanceDetails.transport_mode,
            transportType:conveyanceDetails.transportation_type,
            fromLocation:conveyanceDetails.from_location,
            toLocation:conveyanceDetails.to_location,
            kmTravelled:conveyanceDetails.distance_in_km,
            documents:documents,
            documentToken: documentToken,
            conveyance_id
          };
  
          navigation.navigate('LocalConveyanceForm', { ...params });
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

  const deleteHandler = async (conveyance_id) => {

    const userConfirmed = await showDeleteConfirmation();

    if (userConfirmed) {
      try {
        setLoading(true);
        
        const response = await axios.post(`${EXPENSE_BASE_URL}${LOCAL_EXPENSE_DELETE_API}`, {
          token: EXPENSE_TOKEN,
          local_conveyance_id:conveyance_id
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
    <SafeAreaView style={{backgroundColor:theme.colors.headerColor,flex : 1}} >

    
    <View style={styles.maincontainer}>
    <ExpenseHeader 
      title="Local Conveyance" 
      onPress={() => navigation.goBack()}
      showBackArrow={true} 
    />
  <ScrollView style={styles.container}>
    <Text style={styles.expensesList}>Expense List</Text>
    <Text style={styles.expensesListdesc}>All Local conveyance expenses are listed below</Text>

    <View style={styles.contentContainer}>
      {loading && !data?.length ? (
        <ActivityIndicator size="large" color="#FFCC00" />
      ) : data?.length > 0 ? (
        <>
          {data?.map((item, index) => (
            <LocalListCard
              key={index}
              expense_id={item.expense_id}
              conveyance_date={item.conveyance_date}
              total_amount={item.total_amount}
              status={item.status}
              onClarification={() => viewHandler(item.local_conveyance_id)}
              onView={() => viewHandler(item.local_conveyance_id)}
              onEdit={() => editHandler(item.local_conveyance_id)}
              onDelete={() => deleteHandler(item.local_conveyance_id)}
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

  <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('LocalConveyanceForm')}>
    <Icon name="add" style={styles.fabIcon} />
  </TouchableOpacity>
</View>
</SafeAreaView>

  );
};



export default LocalConveyanceScreen;
