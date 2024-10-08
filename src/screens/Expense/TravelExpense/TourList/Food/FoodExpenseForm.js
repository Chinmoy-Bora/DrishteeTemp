import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import SubmitButton from "../../../../../components/CustomButton1"
import ExpenseHeader  from '../../../../../components/Header/ExpenseHeader';
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "./FoodExpenseFormStyle";
import FileLoader from "../../../../../components/ExpensePageComponents/FileLoader";
import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import {EXPENSE_BASE_URL, EXPENSE_TOKEN,TOURFOOD_EXPENSE_ADD_API ,TOURFOOD_EXPENSE_UPDATE_API} from '@env'
import * as FileSystem from "expo-file-system";
import LoadingPopup from "../../../../../components/LoadingPopup";



const FoodExpenseFrom = ({ navigation,route }) => {
    const { title,fromDate,toDate,tourId }=route.params;
    
    const parseDateFromString = (dateString) => {
   
      const [day, month, year] = dateString.split("/").map(Number);
      
      return new Date(year, month - 1, day); 
    };
    const cdate=parseDateFromString(fromDate)
  
  const [billDate, setBillDate] = useState(cdate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedFoodType, setSelectedFoodType] = useState(null);
  const [totalBillAmount, setTotalBillAmount] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [NoOfPerson, setNoOfPerson] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  

  const [errors, setErrors] = useState({
    billDate: false,
    selectedFoodType: false,
    totalBillAmount: false,
    NoOfPerson:false,
    uploadedFiles: false,
  });

  const isUpdateMode =
    route.params?.date ||
    route.params?.amount ||
    route.params?.NoOfPerson ||
    route.params?.foodType;


  const expenseOptions = [
    { label: "BreakFast", icon: require("../../../../../assets/Expense/breakfast.png") },
    { label: "Lunch", icon: require("../../../../../assets/Expense/lunch.png") },
    { label: "Dinner", icon: require("../../../../../assets/Expense/dinner.png") },
   
  ];



  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || billDate;
    setShowDatePicker(false);
    setBillDate(currentDate);
  };

  const selectFoodType = (item) => {
    setSelectedFoodType(item);
    setDropdownVisible(false);
    setErrors({ ...errors, selectedFoodType: false });
  };

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
    if (isUpdateMode ) {
      console.log("Data from the Local Expense",
        route.params?.date ,
      route.params?.amount ,
      route.params?.NoOfPerson ,
      route.params?.foodType ,
      );
      
      setNoOfPerson(String(route.params?.NoOfPerson))
      setBillDate(isUpdateMode ? parseDateFromString(route.params?.date) : new Date())
      
      const serviceType = expenseOptions.find(
        (option) => option.label == route.params?.foodType
      );
      setSelectedFoodType(serviceType)
      setTotalBillAmount(String(route.params?.amount));
      setUploadedFiles(route.params?.documents || []);
      console.log("Date",uploadedFiles)
    }
    
  }, []);

  const validateForm = () => {
    const newErrors = {
      billDate: !billDate || billDate.toString() === "Invalid Date",
      selectedFoodType: !selectedFoodType,
      totalBillAmount: !totalBillAmount || isNaN(parseFloat(totalBillAmount)) || parseFloat(totalBillAmount) <= 0,
      NoOfPerson:!NoOfPerson || NoOfPerson==="",
      uploadedFiles: uploadedFiles.filter(file => file !== null).length === 0,
    };
  
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };
  
  

  const handleSubmit = async() => {
    if (validateForm()) {
      const formData = {
        billDate: billDate.toLocaleDateString("en-GB"),
        selectedFoodType,
        NoOfPerson,
        totalBillAmount,
        uploadedFiles,
      };
  
      console.log("Form Data:", formData);
      setLoading(true);
      try{
       
        const formData = new FormData();
      formData.append("token", EXPENSE_TOKEN);
      formData.append("tour_id", Number(tourId));
      formData.append("employee_id", String(userData.user_code));
      formData.append("food_expense_date", billDate.toLocaleDateString("en-GB"));
      formData.append("number_of_person", String(NoOfPerson));
      formData.append("food_type", String(selectedFoodType.label));

      formData.append("amount",String(totalBillAmount) ) ;
      formData.append("gst_applicable", 'No');

      formData.append(
        "documents_attach",
        uploadedFiles.length > 0 ? "Yes" : "No"
      );

      
      for (let i = 0; i < uploadedFiles.length; i++) {
        let processedUri = uploadedFiles[i];

        if (processedUri) {
          if (typeof processedUri === "object" && processedUri.bill) {
            processedUri = processedUri.bill;
          }

          if (typeof processedUri === "string") {
            if (processedUri.startsWith("http")) {
              formData.append(`documents${i + 1}`, processedUri);
            } else {
              const fileInfo = await FileSystem.getInfoAsync(processedUri);
              const fileType = fileInfo.uri.split(".").pop().toLowerCase();
              const fileName = `document${i + 1}.${fileType}`;

              let mimeType;
              if (fileType === "pdf") {
                mimeType = "application/pdf";
              } else if (["jpg", "jpeg", "png", "gif"].includes(fileType)) {
                mimeType = `image/${fileType === "jpg" ? "jpeg" : fileType}`;
              } else {
                mimeType = "application/octet-stream"; 
              }
              formData.append(`documents${i + 1}`, {
                uri: fileInfo.uri,
                type: mimeType,
                name: fileName,
              });
            }
          }
        }
      }

      
      if (isUpdateMode) {
        formData.append("expense_id", route.params?.expense_id); 
      }
      console.log(formData);

      const apiUrl = isUpdateMode
        ? `${EXPENSE_BASE_URL}${TOURFOOD_EXPENSE_UPDATE_API}`
        : `${EXPENSE_BASE_URL}${TOURFOOD_EXPENSE_ADD_API}`;

      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          
        },
        maxBodyLength: Infinity, 
      });

      console.log(JSON.stringify(response.data));
      Alert.alert(
        "Form Submitted",
        isUpdateMode
          ? "Your expense has been updated successfully."
          : "Your form has been submitted successfully."
      );
      navigation.navigate("TourList", { title, fromDate,toDate,tourId });

      }catch (error) {
        console.error("Error submitting the form:", error);
        const errorMessage = error.response?.data?.errors?.[0] || "Please try again later.";

        Alert.alert("Submission Error", errorMessage);
      } finally {
        setLoading(false);
      }
  
    } else {
      Alert.alert("Form Error", "Please fill all required fields.");
    }

    
  };



  const formatDateToString = (date) => {
    const day = new Date(date).getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#020242'}}>

    <View style={styles.container}>
    <ExpenseHeader 
                title={isUpdateMode? "Update Food Expenses":"Add Food Expenses" }
                onPress={() => navigation.goBack()}
                showBackArrow={true} />
      
      <ScrollView style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Bill Date</Text>
          <TouchableOpacity style={styles.inputRow} onPress={() => setShowDatePicker(true)}>
            <TextInput
              style={[styles.input, errors.billDate && styles.errorInput]}
              value={isUpdateMode
                ? formatDateToString(billDate)
                :billDate.toLocaleDateString("en-GB")}
              editable={false}
            />
            <FontAwesome name="calendar" size={24} color="#F7B32B" style={styles.icon} />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={billDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={parseDateFromString(toDate)}
              minimumDate={parseDateFromString(fromDate)}
            />
          )}
        </View>

        {/* Mode Of Transport */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Select Food Type</Text>
          <TouchableOpacity style={[styles.inputRow, errors.selectedFoodType && styles.errorInput]} onPress={() => setDropdownVisible(!dropdownVisible)}>
            {selectedFoodType ? (
              <>
                <Image source={selectedFoodType.icon} style={styles.iconImage} />
                <TextInput
                  style={[styles.input, styles.expenseTypeInput]}
                  value={selectedFoodType.label}
                  editable={false}
                />
              </>
            ) : (
              <TextInput
                style={[styles.input, styles.expenseTypeInput]}
                value=""
                placeholder="Select expense type"
                placeholderTextColor="#aaa"
                editable={false}
              />
            )}
            <FontAwesome name="chevron-down" size={24} color="#F7B32B" style={styles.icon} />
          </TouchableOpacity>

          {/* Dropdown Modal */}
          <Modal visible={dropdownVisible} transparent={true} animationType="fade">
            <TouchableOpacity style={styles.modalOverlay} onPress={() => setDropdownVisible(false)}>
              <View style={styles.dropdownContainer}>
                <FlatList
                  data={expenseOptions}
                  keyExtractor={(item) => item.label}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.dropdownItem} onPress={() => selectFoodType(item)}>
                      <Image source={item.icon} style={styles.iconImage} />
                      <Text style={styles.dropdownItemText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Number of Person</Text>
          <TextInput
            style={[styles.inputRow, errors.NoOfPerson && styles.errorInput]}
            value={NoOfPerson}
            placeholder="Start Location"
            onChangeText={(text) => {
              setNoOfPerson(text);
              setErrors({ ...errors, NoOfPerson: false });
            }}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Total Bill Amount</Text>
          <TextInput
            style={[styles.inputRow, errors.totalBillAmount && styles.errorInput]}
            value={totalBillAmount}
            placeholder="Total Amount"
            keyboardType="numeric"
            onChangeText={(text) => {
              setTotalBillAmount(text);
              setErrors({ ...errors, totalBillAmount: false });
            }}
            
          />
        </View>


        {/* File Upload Section */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Upload bills [.pdf, .jpeg, .jpg, .png]</Text>
          <FileLoader onUpload={(files) => {
                setUploadedFiles(files);
                if (files.filter(file => file !== null).length > 0) {
                    setErrors({ ...errors, uploadedFiles: false });
                  }
              }}
              error={errors.uploadedFiles}
              initialFiles={
                route.params?.documents?.map((doc) => doc.bill) || []
              }
              documentToken={route.params?.documentToken}
              isUpdateMode={isUpdateMode}
               />

        </View>

       
        <SubmitButton title={isUpdateMode? "Update":"Submit" } loading={loading}
 onPress={handleSubmit}/>
        <LoadingPopup visible={loading} message="Submitting..." />
      </ScrollView>
    </View>
    </SafeAreaView>
  );
};

export default FoodExpenseFrom;
