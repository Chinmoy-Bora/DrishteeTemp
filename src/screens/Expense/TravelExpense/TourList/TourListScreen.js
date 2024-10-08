import React, {useState} from "react";
import styles from "./TourListScreenStyle";
import { View, Text, Image, TouchableOpacity, ActivityIndicator,Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import ExpenseHeader from '../../../../components/Header/ExpenseHeader';

import RectangleButton from "../../../../components/ExpensePageComponents/RectangleButton";
import { ScrollView } from "react-native-gesture-handler";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { EXPENSE_BASE_URL,  TOUR_ALL_EXPENSELIST_API, EXPENSE_TOKEN, DOCUMENT_BEARER_TOKEN, DOCUMENT_TOKEN_API, TOURCONVEYANCE_EXPENSE_DETAILS_API, TOURCONVEYANCE_EXPENSE_DELETE_API,TOURACCOUMODATION_EXPENSE_DETAILS_API, TOURACCOUMODATION_EXPENSE_DELETE_API,TOURFOOD_EXPENSE_DETAILS_API, TOURFOOD_EXPENSE_DELETE_API, TOUROTHER_EXPENSE_DETAILS_API, TOUROTHER_EXPENSE_DELETE_API } from '@env';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import LocalListCard from "../../../../components/ExpensePageComponents/LocalListCard";

const TourListScreen = ({ navigation,route }) => {
    const {title, fromDate, toDate,tourId,status}=route.params;

    const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);


  const fetchData = async () => {
    setLoading(true);

    try {
       
        const userData = await SecureStore.getItemAsync('DrishteeuserData');
        const { user_code } = JSON.parse(userData);
        
        const response = await axios.post(
            `${EXPENSE_BASE_URL}${TOUR_ALL_EXPENSELIST_API}`,
            {
                token: EXPENSE_TOKEN,
                employee_id: user_code,
                tourid:tourId
            },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            }
        );
        
        console.log("Tour List",response.data)
        setData(response.data.expenses);

        
        

        
        
    } catch (error) {
        console.error("Error fetching data:", error);
        setData([]); 
    } finally {
        setLoading(false);
    }
};
  useFocusEffect(
    useCallback(() => {
        
        fetchData(); 
    }, [])
);

const fetchExpenseDetails = async (expense_id,expense_title) => {
  try {
    let apiUrl;
    if(expense_title==='Conveyance'){
      apiUrl=`${EXPENSE_BASE_URL}${TOURCONVEYANCE_EXPENSE_DETAILS_API}`;
    }else if(expense_title==='Accommodation'){
      apiUrl = `${EXPENSE_BASE_URL}${TOURACCOUMODATION_EXPENSE_DETAILS_API}`;
    }else if (expense_title==="Food"){
      apiUrl = `${EXPENSE_BASE_URL}${TOURFOOD_EXPENSE_DETAILS_API}`;
    }else{
      apiUrl = `${EXPENSE_BASE_URL}${TOUROTHER_EXPENSE_DETAILS_API}`;
    }
      const response = await axios.post(apiUrl, {
          token: EXPENSE_TOKEN,
          expense_id: expense_id
      }, {
          headers: { 
              'Content-Type': 'application/x-www-form-urlencoded'
          },
      });

      

      console.log(response.data)
      return response.data.formattedData;
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

const viewHandler = async (expense_id,expense_title) => {
  try {
    setLoading(true);

    const conveyanceDetails = await fetchExpenseDetails(expense_id,expense_title);
    const documentToken = await fetchDocumentToken();
    
    
    if (conveyanceDetails && expense_title==="Conveyance") {
      
      const documents = conveyanceDetails.DrishteeTourConveyanceExpenseUploads || [];

      const params = {
        date: String(conveyanceDetails.DrishteeExpense?.expense_date),
        status: String(conveyanceDetails.DrishteeExpense.status),
        category: String(conveyanceDetails.DrishteeExpense.expense_title),
        amount: String(conveyanceDetails.amount),
        billIssuedBy: conveyanceDetails.bill_issue_by ? String(conveyanceDetails.bill_issue_by) : '-',
        
        gstApplicable: String(conveyanceDetails.gst_applicable),
        documentAttach: String(conveyanceDetails.documents_attach),
        
        
        fromLocation: String(conveyanceDetails.from_location),
        toLocation: String(conveyanceDetails.to_location),
        km: String(conveyanceDetails.distance),
       
        gstAmount: String(conveyanceDetails.gst_amount),
        withoutGstAmount: String(conveyanceDetails.without_gst_amount),
        
        ConveyanceDocuments: documents, 
        documentToken: documentToken,
        expense_id:conveyanceDetails.DrishteeExpense.expense_id,
      };

      navigation.navigate('ViewExpense', { ...params });
    }else if (conveyanceDetails && expense_title==="Accommodation"){
      const documents = conveyanceDetails.TourExpenseAccommodationUploads || [];

      const params = {
        date: String(conveyanceDetails.DrishteeExpense?.expense_date),
        status: String(conveyanceDetails.DrishteeExpense.status),
        category: String(conveyanceDetails.DrishteeExpense.expense_title),
        amount: String(conveyanceDetails.amount),
       
        documentAttach: String(conveyanceDetails.documents_attach),
        
        StayLocation: String(conveyanceDetails.stay_location),
        StayIn: String(conveyanceDetails.hotel_name),
        NoOfPerson: String(conveyanceDetails.check_in_no_of_person),
        checkInDate: String(conveyanceDetails.check_in_date),
        checkInTime:String(conveyanceDetails.check_in_time),
        checkOutDate: String(conveyanceDetails.check_out_date),
        checkOutTime:String(conveyanceDetails.check_out_time),
        serviceType: String(conveyanceDetails.service_type),
       
       
        
        ConveyanceDocuments: documents, 
        documentToken: documentToken,
        expense_id:conveyanceDetails.DrishteeExpense.expense_id,
      };

      navigation.navigate('ViewExpense', { ...params });
    } else if (conveyanceDetails && expense_title==="Food"){
      const documents = conveyanceDetails.DrishteeTourFoodExpenseUploads || [];

      const params = {
        date: String(conveyanceDetails.DrishteeExpense?.expense_date),
        status: String(conveyanceDetails.DrishteeExpense.status),
        category: String(conveyanceDetails.DrishteeExpense.expense_title),
        amount: String(conveyanceDetails.amount),
        documentAttach: String(conveyanceDetails.documents_attach),
        
        NoOfPerson: String(conveyanceDetails.number_of_person),
        foodType: String(conveyanceDetails.food_type),
       
       
        
        ConveyanceDocuments: documents, 
        documentToken: documentToken,
        expense_id:conveyanceDetails.DrishteeExpense.expense_id,
      };

      navigation.navigate('ViewExpense', { ...params });

    }else{
      const documents = conveyanceDetails.DrishteeTourOtherExpenseUploads || [];

      const params = {
        date: String(conveyanceDetails.DrishteeExpense?.expense_date),
        status: String(conveyanceDetails.DrishteeExpense.status),
        category: String(conveyanceDetails.DrishteeExpense.expense_title),
        amount: String(conveyanceDetails.amount),
        documentAttach: String(conveyanceDetails.documents_attach),
        
        remarks: String(conveyanceDetails.remarks),
        expenseType: String(conveyanceDetails.expense_type),
       
       
        
        ConveyanceDocuments: documents, 
        documentToken: documentToken,
        expense_id:conveyanceDetails.DrishteeExpense.expense_id,
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

const editHandler= async( expense_id,expense_title) => {
  setLoading(true);
  try {
    const conveyanceDetails = await fetchExpenseDetails(expense_id,expense_title);
    const documentToken = await fetchDocumentToken();

    if (conveyanceDetails && expense_title==="Conveyance") {
        const documents = conveyanceDetails.DrishteeTourConveyanceExpenseUploads || [];
       
        
        const params = {
          totalBillAmount:conveyanceDetails.amount,
          billDate:conveyanceDetails.DrishteeExpense?.expense_date,
          remarks:conveyanceDetails.visit_purpose,
          modeOfTransport:conveyanceDetails.conveyance_mode,
          transportType:conveyanceDetails.conveyance_hire,
          fromLocation:conveyanceDetails.from_location,
          toLocation:conveyanceDetails.to_location,
          kmTravelled:conveyanceDetails.distance,
          documents:documents,
          documentToken: documentToken,
          expense_id,
          title,fromDate,toDate,tourId
        };

        navigation.navigate('TourListConveyance', { ...params });
    }else if (conveyanceDetails && expense_title==="Accommodation"){
      const documents = conveyanceDetails.TourExpenseAccommodationUploads || [];

      const params = {
        date: conveyanceDetails.DrishteeExpense?.expense_date,
        amount: conveyanceDetails.amount,
        StayLocation: conveyanceDetails.stay_location,
        StayIn: conveyanceDetails.hotel_name,
        NoOfPerson: conveyanceDetails.check_in_no_of_person,
        checkInDate: conveyanceDetails.check_in_date,
        checkInTime:conveyanceDetails.check_in_time,
        checkOutDate: conveyanceDetails.check_out_date,
        checkOutTime:conveyanceDetails.check_out_time,
        serviceType: conveyanceDetails.service_type,
       
       
        
        documents: documents, 
        documentToken: documentToken,
        expense_id,
        title,fromDate,toDate,tourId
      };

      navigation.navigate('AccommodationForm', { ...params });

    }else if (conveyanceDetails && expense_title==="Food"){
      const documents = conveyanceDetails.DrishteeTourFoodExpenseUploads || [];

      const params = {
        date: String(conveyanceDetails.DrishteeExpense?.expense_date),
        amount: String(conveyanceDetails.amount),
        NoOfPerson: String(conveyanceDetails.number_of_person),
        foodType: String(conveyanceDetails.food_type),
       
       
        
        documents: documents, 
        documentToken: documentToken,
        expense_id,
        title,fromDate,toDate,tourId
      };

      navigation.navigate('FoodExpense', { ...params });

    }else{
      const documents = conveyanceDetails.DrishteeTourOtherExpenseUploads || [];

      const params = {
        date: String(conveyanceDetails.DrishteeExpense?.expense_date),
        amount: String(conveyanceDetails.amount),
        remarks: String(conveyanceDetails.remarks),
        expenseType: String(conveyanceDetails.expense_type),
       
        documents: documents, 
        documentToken: documentToken,
        expense_id,
        title,fromDate,toDate,tourId
      };

      navigation.navigate('TravelOtherExpense', { ...params });

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

const deleteHandler = async (expense_id,expense_title) => {

  const userConfirmed = await showDeleteConfirmation();

  if (userConfirmed) {
    try {
      setLoading(true);
      let apiUrl;
    if(expense_title==='Conveyance'){
      apiUrl=`${EXPENSE_BASE_URL}${TOURCONVEYANCE_EXPENSE_DELETE_API}`;
    }else if(expense_title==='Accommodation'){
      apiUrl = `${EXPENSE_BASE_URL}${TOURACCOUMODATION_EXPENSE_DELETE_API}`;
    }else if(expense_title==="Food"){
      apiUrl = `${EXPENSE_BASE_URL}${TOURFOOD_EXPENSE_DELETE_API}`;
    }else{
      apiUrl = `${EXPENSE_BASE_URL}${TOUROTHER_EXPENSE_DELETE_API}`;
    }
      
      
      const response = await axios.post(apiUrl, {
        token: EXPENSE_TOKEN,
        expense_id:expense_id
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
      Alert.alert("Deletion Failed", "Expense deletion Failed, Please try again Later.");
      fetchData()
    } finally {
      setLoading(false);
    }
  } else {
      console.log("Deletion cancelled by the user.");
  }
}

    
  return (
    <View style={styles.container}>
        <ExpenseHeader
      title={title} 
      onPress={() => navigation.goBack()}
      showBackArrow={true} 
    />
      <ScrollView>

        {status!="Submitted"?
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Expenses Type</Text>

        <View style={styles.buttonContainer}>
          <RectangleButton
            imageSource={require("../../../../assets/Expense/ElectricityExp.png")}
            text="Conveyance"
            backgroundColor="#fff"
            onPress={() => navigation.navigate("TourListConveyance", {
                title,
                fromDate,
                toDate,
                tourId
              })}
          />
          <RectangleButton
            imageSource={require("../../../../assets/Expense/rent.png")}
            text="Food"
            backgroundColor="#fff"
            onPress={() => navigation.navigate("FoodExpense", {
              title,
              fromDate,
              toDate,
              tourId
              })}
          />
          
        </View>
        <View style={styles.buttonContainer}>
          <RectangleButton
            imageSource={require("../../../../assets/Expense/accommodation.png")}
            text="Accommodation"
            backgroundColor="#fff"
            onPress={() => navigation.navigate("AccommodationForm", {
              title,
              fromDate,
              toDate,
              tourId
              })}
          />
          <RectangleButton
            imageSource={require("../../../../assets/Expense/stationary.png")}
            text="Other Expenses"
            backgroundColor="#fff"
            onPress={() => navigation.navigate("TravelOtherExpense",{
              title,
              fromDate,
              toDate,
              tourId
              })}
          />
          
        </View>
      </View> : <View></View>}
      <Text style={styles.expensesList}>Expenses List</Text>
      <View style={styles.contentContainer}>
      {loading && !data?.length ? (
        <ActivityIndicator size="large" color="#FFCC00" />
      ) : data?.length > 0 ? (
        <>
          {data?.map((item, index) => (
            <LocalListCard
              key={index}
              expenseTitle={item.expense_title}
              expense_id={item.expense_id}
              conveyance_date={item.expense_date}
              total_amount={item.expense_amount}
              status={item.status}
              onClarification={() => viewHandler(item.expense_id,item.expense_title)}
              onView={() => viewHandler(item.expense_id,item.expense_title)}
              onEdit={() => editHandler(item.expense_id,item.expense_title)}
              onDelete={() => deleteHandler(item.expense_id,item.expense_title)}
            />
          ))}
          
        </>
      ) : (
        <View style={styles.emptyStateContainer}>
          <Image source={require('../../../../assets/nodata.png')} style={styles.emptyStateImage} />
          <Text style={styles.noDataText}>No data available</Text>
        </View>
      )}
    </View>

      

      </ScrollView>
      
    </View>
  );
};

export default TourListScreen;
