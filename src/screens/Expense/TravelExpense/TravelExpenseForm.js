import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  SafeAreaView,
  Alert,
  ScrollView,
} from "react-native";
import ExpenseHeader  from '../../../components/Header/ExpenseHeader';
import SubmitButton from "../../../components/CustomButton1"

import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "./TravelExpenseFormStyle";
import LoadingPopup from "../../../components/LoadingPopup";
import * as SecureStore from "expo-secure-store";
import axios from 'axios';
import {EXPENSE_TOKEN, TOUR_EXPENSE_ADD_API, EXPENSE_BASE_URL, TOUR_EXPENSE_UPDATE_API } from '@env'

const TravelExpenseForm = ({ navigation, route }) => {
    const [tripName, setTripName] = useState("");
    const [tourPartner, setTourPartner] = useState("");
    const [remarks, setRemarks] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);

    const isUpdateMode =
    route.params?.tripName ||
    route.params?.startDate ||
    route.params?.endDate ||
    route.params?.remarks ||
    route.params?.tourPartner;


    const getUserData = async () => {
      try {
        const data = await SecureStore.getItemAsync('DrishteeuserData');
        
        if (data) {
          const parsedData = JSON.parse(data);
          setUserData(parsedData);
        } else {
          console.error('No user data found in SecureStore.');
        }
      } catch (error) {
        console.error('Error retrieving user data:', error.message);
      }
    };
    
    useEffect(() => {
      getUserData();
    }, []);

    useEffect(() => {
      if (isUpdateMode) {
       
        setTripName(route.params?.tripName);
        setStartDate(isUpdateMode ? parseDateFromString(route.params?.startDate) : new Date())
        setEndDate(isUpdateMode ? parseDateFromString(route.params?.endDate) : new Date())
        setRemarks(route.params?.remarks);
        setTourPartner(route.params?.tourPartner);
        
        
      }
    }, []);


    const [errors, setErrors] = useState({
        tripName: false,
        startDate: false,
        endDate: false,
        remarks: false,
      });

      const handleDateChange = (event, selectedDate, setDate) => {
        const currentDate = selectedDate || new Date();
        setDate(currentDate);
      };

      const validateForm = () => {
        const newErrors = {
          tripName: !tripName,
          startDate: !startDate || startDate.toString() === "Invalid Date",
          endDate: !endDate || endDate.toString() === "Invalid Date",
          remarks: !remarks,
        };
        setErrors(newErrors);
        return Object.values(newErrors).every((error) => !error);
      };
  
  

      const handleSubmit = async() => {
        if (validateForm()) {
          
          const data = {
            tourPartner,
            tripName
            
          };
          console.log("FormData",data)
        } else {
          Alert.alert("Form Error", "Please fill all the fields.");
          return;
    
        }
          setLoading(true);
          try{
            const formData = new FormData();
          formData.append("token", EXPENSE_TOKEN);
          formData.append("employee_id", String(userData.user_code));
          formData.append("trip_name", tripName);
          formData.append("trip_start_date", startDate.toLocaleDateString("en-GB"));
          formData.append("trip_end_date", endDate.toLocaleDateString("en-GB"));
          formData.append("purpose_of_visit", remarks);
          formData.append("partner_name", tourPartner ? tourPartner : "");
          if (isUpdateMode) {
            formData.append("tour_id", route.params?.tour_id); 
          }

    
          

          console.log(formData);
    
          const apiUrl = isUpdateMode
          ? `${EXPENSE_BASE_URL}${TOUR_EXPENSE_UPDATE_API}`
          :`${EXPENSE_BASE_URL}${TOUR_EXPENSE_ADD_API}`;
    
          const response = await axios.post(apiUrl, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              
            },
            maxBodyLength: Infinity, 
          });
    
          console.log(JSON.stringify(response.data));
          Alert.alert(
            "Form Submitted", isUpdateMode
            ? "Your expense has been updated successfully."
            : "Your form has been submitted successfully."
          );
          navigation.navigate("TravelExpense");
    
          }catch (error) {
            console.error("Error submitting the form:", error);
            const errorMessage = error.response?.data?.errors?.[0] || "Please try again later.";
    
            Alert.alert("Submission Error", errorMessage);
          } finally {
            setLoading(false);
          }
        
      };
      const formatDateToString = (date) => {
        const day = new Date(date).getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };
      const parseDateFromString = (dateString) => {
        const [day, month, year] = dateString.split("/").map(Number);
        return new Date(year, month - 1, day); 
      };

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#020242'}}>

    <View style={styles.container}>
     
<ExpenseHeader 
                title={isUpdateMode? "Update Tour":"Add new Tour" }
                onPress={() => navigation.goBack()}
                showBackArrow={true} />

      <ScrollView style={styles.formContainer}>


      <View style={styles.formGroup}>
          <Text style={styles.label}>Create Trip Name</Text>
          <TextInput
            style={[styles.inputRow, errors.tripName && styles.errorInput]}
            value={tripName}
            onChangeText={(text) => {
              setTripName(text);
              setErrors({ ...errors, tripName: false });
            }}
            placeholder="Example: Nashik-Mumbai-Delhi Trip"

          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Travel Start Date</Text>
          <TouchableOpacity style={styles.inputRow} onPress={() => setShowStartDatePicker(true)}>
            <TextInput
              style={[styles.input, errors.startDate && styles.errorInput]}
              value={isUpdateMode
                ? formatDateToString(startDate)
                : startDate.toLocaleDateString("en-GB")}
              editable={false}
            />
            <FontAwesome name="calendar" size={24} color="#F7B32B" style={styles.icon} />
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowStartDatePicker(false);
                handleDateChange(event, date, setStartDate);
              }}
            />
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Travel End Date</Text>
          <TouchableOpacity style={styles.inputRow} onPress={() => setShowEndDatePicker(true)}>
            <TextInput
              style={[styles.input, errors.endDate && styles.errorInput]}
              value={isUpdateMode
                ? formatDateToString(endDate)
                : endDate.toLocaleDateString("en-GB")}
              editable={false}
            />
            <FontAwesome name="calendar" size={24} color="#F7B32B" style={styles.icon} />
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              minimumDate={startDate}
              onChange={(event, date) => {
                setShowEndDatePicker(false);
                handleDateChange(event, date, setEndDate);
              }}
            />
          )}
        </View>


        <View style={styles.formGroup}>
          <Text style={styles.label}>Purpose of Visit</Text>
          <TextInput
            style={[styles.remarksInput, errors.remarks && styles.errorInput]}
            value={remarks}
            onChangeText={(text) => {
                setRemarks(text)
                setErrors({ ...errors, remarks: false });
            }}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tour Partner Name(If any)</Text>
          <TextInput
            style={[styles.inputRow]}
            value={tourPartner}
              onChangeText={(text) => {
                setTourPartner(text);
              }}

          />
        </View>
        <SubmitButton title={isUpdateMode? "Update":"Submit" } loading={loading}
 onPress={handleSubmit}/>
        <LoadingPopup visible={loading} message="Submitting..." />
        
        {/* <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
          <LoadingPopup visible={loading} message="Submitting..." />
        </TouchableOpacity> */}
      </ScrollView>
    </View>
    </SafeAreaView>
  );
};

export default TravelExpenseForm;
