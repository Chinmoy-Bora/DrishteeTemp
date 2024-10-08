// OfficeExpenseForm.js

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
  ScrollView,
  SafeAreaView
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import ExpenseHeader  from '../../../components/Header/ExpenseHeader';
import SubmitButton from "../../../components/CustomButton1"

import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "./OfficeExpenseFormStyle";
import FileLoader from "../../../components/ExpensePageComponents/FileLoader";
import LoadingPopup from "../../../components/LoadingPopup";
import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system";
import { OFFICE_EXPENSE_ADD_API, EXPENSE_BASE_URL, OFFICE_EXPENSE_UPDATE_API } from '@env'
import axios from 'axios';
import theme from "../../../utils/theme";

const OfficeExpenseForm = ({
    navigation, route
}) => {

    const { headerTitle, fieldsToShow = [], requiredFields = [] } = route.params;

 


  const [officeLocation, setOfficeLocation] = useState("");
  const [billDate, setBillDate] = useState(new Date());
  const [showBillDatePicker, setBillShowDatePicker] = useState(false);
  const [officeOwner, setOfficeOwner] = useState("");
  const [expenseType, setExpenseType] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [totalBillAmount, setTotalBillAmount] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [otherExpenseName, setOtherExpenseName] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const isUpdateMode =
    route.params?.totalBillAmount ||
    route.params?.officeLocation ||
    route.params?.billDate ||
    route.params?.documents ||
    route.params?.remarks || 
    route.params?.officeOwner|| 
    route.params?.dueDate;


  const [errors, setErrors] = useState({
    officeLocation: false,
    billDate: false,
    dueDate: false,
    officeOwner: false,
    expenseType: false,
    remarks: false,
    totalBillAmount: false,
    uploadedFiles: false,
    otherExpenseName:false
  });

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
    console.log("Data From the OfficeScreen:",
    route.params?.totalBillAmount,
    route.params?.expenseType ,
    route.params?.billDate ,
    route.params?.documents ,
    route.params?.remarks , 
    )
    if (isUpdateMode && headerTitle==='Rent Expenses') {
      
      setBillDate(isUpdateMode ? parseDateFromString(route.params?.billDate) : new Date());
      setDueDate(isUpdateMode ? parseDateFromString(route.params?.dueDate) : new Date())
      setTotalBillAmount(route.params?.totalBillAmount)
      setRemarks(route.params?.remarks);
      setOfficeLocation(route.params?.officeLocation);
      setOfficeOwner(route.params?.officeOwner);
      setUploadedFiles(route.params?.documents || []);
    }
    else if (isUpdateMode && headerTitle==='Other Expenses') {

      if(route.params?.expenseType==="Cleaning"){
        const selectET= expenseOptions.find((option)=>option.label===route.params?.expenseType)
        setExpenseType(selectET)
      }else{
        const selectET= expenseOptions.find((option)=>option.label==='Other')
        setExpenseType(selectET)
        setOtherExpenseName(route.params?.expenseType)

      }
      setBillDate(isUpdateMode ? parseDateFromString(route.params?.billDate) : new Date());
      setTotalBillAmount(route.params?.totalBillAmount)
      setRemarks(route.params?.remarks);
      setUploadedFiles(route.params?.documents || []);
    } else if(isUpdateMode){
      setBillDate(isUpdateMode ? parseDateFromString(route.params?.billDate) : new Date());
      setTotalBillAmount(route.params?.totalBillAmount)
      setRemarks(route.params?.remarks);
      setUploadedFiles(route.params?.documents || []);
    }
  }, []);

  const expenseOptions = [
    { label: "Cleaning", icon: require("../../../assets/Expense/cleaning.png") },
    { label: "Other", icon: require("../../../assets/Expense/other.png") },
  ];

  const handleDateChange = (event, selectedDate, setDate) => {
    const currentDate = selectedDate || new Date();
    setDate(currentDate);
  };

  const selectExpenseType = (item) => {
    setExpenseType(item);
    setDropdownVisible(false);
    setErrors({ ...errors, expenseType: false });
  
    if (item.label === "Other") {
      
    } else {
      setOtherExpenseName("");
      setErrors({ ...errors, otherExpenseName: false });
    }
  };

  const validateForm = () => {
    const newErrors = {
      officeLocation: requiredFields.includes("officeLocation") && !officeLocation,
      officeOwner: requiredFields.includes("officeOwner") && !officeOwner,
      billDate: requiredFields.includes("billDate") && (!billDate || billDate.toString() === "Invalid Date"),
      dueDate: requiredFields.includes("dueDate") && (!dueDate || dueDate.toString() === "Invalid Date"),
      expenseType: requiredFields.includes("expenseType") && !expenseType,
      remarks: requiredFields.includes("remarks") && !remarks,
      totalBillAmount: requiredFields.includes("totalBillAmount") &&
        (!totalBillAmount || isNaN(parseFloat(totalBillAmount)) || parseFloat(totalBillAmount) <= 0),
      uploadedFiles: requiredFields.includes("uploadedFiles") && uploadedFiles.filter((file) => file !== null).length === 0,
      otherExpenseName: expenseType?.label === "Other" && requiredFields.includes("expenseType") && !otherExpenseName.trim(),
    };
  
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };
  

  const handleSubmit = async() => {
    if (validateForm()) {
      const data = {
        billDate: billDate.toLocaleDateString("en-GB"),
        officeLocation,
        dueDate,
        officeOwner,
        expenseType,
        remarks,
        totalBillAmount,
        uploadedFiles,
        otherExpenseName
      };
      console.log("FormData",data)
     
    } else {
      Alert.alert("Form Error", "Please fill all required fields.");
      return;
    }

    setLoading(true);
      try{
        const formData = new FormData();
        formData.append("token", "b3ebc7cbffd93a61b3ddafc37706dd47");
        formData.append("employee_id", String(userData.user_code));
        formData.append("expense_title", headerTitle);
        formData.append("office_expense_date", billDate.toLocaleDateString("en-GB"));
        if(headerTitle==='Other Expenses'){
          if (expenseType.label==='Other'){
            formData.append("other_expense", otherExpenseName);
          }else{
            formData.append("other_expense", expenseType.label);
          }
          
        }
        
        formData.append("description", remarks==="" ? "NoTest" : remarks);
        formData.append("expense_amount", String(totalBillAmount));
        if (headerTitle==='Rent Expenses'){
          formData.append("office_location", officeLocation==="" ? "NoTest" : officeLocation);
        formData.append("office_owner", officeOwner==="" ? "NoTest" : officeOwner);
          formData.append("due_date", dueDate.toLocaleDateString("en-GB"));
        }
        formData.append("bill_issue_by", "NoText");
        formData.append("advance_required", "123");
        formData.append("gst_applicable", 'No');
        formData.append("company_id", '101');
        formData.append("gst_no_submitted", "101");
        formData.append("without_gst_amount", "0");
        formData.append("gst_amount", "0");
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

        console.log("Form Data from theForm:",formData)
        if (isUpdateMode) {
          formData.append("office_expense_id", route.params?.officeExpense_id); 
        }
        console.log(formData);

        const apiUrl = isUpdateMode
          ? `${EXPENSE_BASE_URL}${OFFICE_EXPENSE_UPDATE_API}`
          : `${EXPENSE_BASE_URL}${OFFICE_EXPENSE_ADD_API}`;

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

        navigation.navigate("OffieExpense");

      }catch (error) {
        console.error("Error submitting the form:", error);
        const errorMessage = error.response?.data?.errors?.[0] || "Please try again later.";
        const firheeb=error.message;
        Alert.alert("Submission Error", firheeb);
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
  const getMinimumDate = () => {
    const today = new Date();
    const currentDay = today.getDate();
    if (currentDay <= 7) {
      return new Date(today.getFullYear(), today.getMonth() - 1, 1);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  };

  return (
    <SafeAreaView style={{flex:1,backgroundColor:theme.colors.headerColor}}>

    <View style={styles.container}>
    <ExpenseHeader 
                title={isUpdateMode? `Update ${headerTitle}`:`Add ${headerTitle}` }
                onPress={() => navigation.goBack()}
                showBackArrow={true} />
      

      <ScrollView style={styles.formContainer}>
        {fieldsToShow.includes("officeLocation") && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Office Location</Text>
            <TextInput
              style={[styles.inputRow, errors.officeLocation && styles.errorInput]}
              value={officeLocation}
              placeholder="Enter Office Location"
              onChangeText={(text) => {
                setOfficeLocation(text);
                setErrors({ ...errors, officeLocation: false });
              }}
            />
          </View>
        )}

        {fieldsToShow.includes("billDate") && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Bill Date</Text>
            <TouchableOpacity style={styles.inputRow} onPress={() => setBillShowDatePicker(true)}>
              <TextInput
                style={[styles.input, errors.billDate && styles.errorInput]}
                value={isUpdateMode
                  ? formatDateToString(billDate)
                  : billDate.toLocaleDateString("en-GB")}
                editable={false}
              />
              <FontAwesome name="calendar" size={24} color="#F7B32B" style={styles.icon} />
            </TouchableOpacity>
            {showBillDatePicker && (
              <DateTimePicker
                value={billDate}
                mode="date"
                display="default"
                maximumDate={new Date()}
                minimumDate={getMinimumDate()}
                onChange={(event, date) => {
                  setBillShowDatePicker(false);
                  handleDateChange(event, date, setBillDate);
                }}
              />
            )}
          </View>
        )}

        {fieldsToShow.includes("officeOwner") && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Office Owner</Text>
            <TextInput
              style={[styles.inputRow, errors.officeOwner && styles.errorInput]}
              value={officeOwner}
              placeholder="Enter Office Owner"
              onChangeText={(text) => {
                setOfficeOwner(text);
                setErrors({ ...errors, officeOwner: false });
              }}
            />
          </View>
        )}

        {fieldsToShow.includes("expenseType") && (
        <View style={styles.formGroup}>
            <Text style={styles.label}>Select Expense Type</Text>
            <TouchableOpacity
            style={[styles.inputRow, errors.expenseType && styles.errorInput]}
            onPress={() => setDropdownVisible(!dropdownVisible)}
            >
            {expenseType ? (
                <>
                <Image source={expenseType.icon} style={styles.iconImage} />
                <TextInput
                    style={[styles.input, styles.expenseTypeInput]}
                    value={expenseType.label}
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

            <Modal visible={dropdownVisible} transparent={true} animationType="fade">
            <TouchableOpacity
                style={styles.modalOverlay}
                onPress={() => setDropdownVisible(false)}
            >
                <View style={styles.dropdownContainer}>
                <FlatList
                    data={expenseOptions}
                    keyExtractor={(item) => item.label}
                    renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => selectExpenseType(item)}
                    >
                        <Image source={item.icon} style={styles.iconImage} />
                        <Text style={styles.dropdownItemText}>{item.label}</Text>
                    </TouchableOpacity>
                    )}
                />
                </View>
            </TouchableOpacity>
            </Modal>
        </View>
        )}

        {expenseType?.label === "Other" && (
        <View style={styles.formGroup}>
            <Text style={styles.label}>Other Expense Name</Text>
            <TextInput
            style={[styles.inputRow, errors.otherExpenseName && styles.errorInput]}
            value={otherExpenseName}
            onChangeText={(text) => {
                setOtherExpenseName(text);
                setErrors({ ...errors, otherExpenseName: text.trim() === "" });
            }}
            placeholder="Enter other expense name"
            />
        </View>
        )}


        {fieldsToShow.includes("remarks") && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.remarksInput, errors.remarks && styles.errorInput]}
              value={remarks}
              onChangeText={(text) => {
                setRemarks(text);
                setErrors({ ...errors, remarks: false });
              }}
            />
          </View>
        )}

        {fieldsToShow.includes("dueDate") && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity style={styles.inputRow} onPress={() => setShowDueDatePicker(true)}>
              <TextInput
                style={[styles.input, errors.dueDate && styles.errorInput]}
                value={isUpdateMode
                  ? formatDateToString(dueDate)
                  : dueDate.toLocaleDateString("en-GB")}
                editable={false}
              />
              <FontAwesome name="calendar" size={24} color="#F7B32B" style={styles.icon} />
            </TouchableOpacity>
            {showDueDatePicker && (
              <DateTimePicker
                value={dueDate}
                mode="date"
                display="default"
                maximumDate={new Date()}
                minimumDate={getMinimumDate()}
                onChange={(event, date) => {
                  setShowDueDatePicker(false);
                  handleDateChange(event, date, setDueDate);
                }}
              />
            )}
          </View>
        )}

        {fieldsToShow.includes("totalBillAmount") && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Total Bill Amount</Text>
            <TextInput
              style={[styles.inputRow, errors.totalBillAmount && styles.errorInput]}
              value={totalBillAmount}
              placeholder="Enter Bill Amount"
              keyboardType="numeric"
              onChangeText={(text) => {
                setTotalBillAmount(text);
                setErrors({ ...errors, totalBillAmount: false });
              }}
            />
          </View>
        )}

        {fieldsToShow.includes("uploadedFiles") && (
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
        )}
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

export default OfficeExpenseForm;
