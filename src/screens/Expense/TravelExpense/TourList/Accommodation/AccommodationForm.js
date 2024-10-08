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
import styles from "./AccommodationFormStyle";
import FileLoader from "../../../../../components/ExpensePageComponents/FileLoader";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {EXPENSE_BASE_URL,TOURACCOUMODATION_EXPENSE_ADD_API,EXPENSE_TOKEN, TOURACCOUMODATION_EXPENSE_UPDATE_API } from '@env'
import * as FileSystem from "expo-file-system";
import LoadingPopup from "../../../../../components/LoadingPopup";

const AccommodationForm = ({ navigation, route }) => {
  const { title,fromDate,toDate,tourId } = route.params;
  
  const parseDateFromString = (dateString) => {
   
    const [day, month, year] = dateString.split("/").map(Number);
    
    return new Date(year, month - 1, day); 
  };
  const cdate=parseDateFromString(fromDate)
  const [serviceType, setserviceType] = useState(null);
  const [totalBillAmount,setTotalBillAmount]= useState("")
  const [stayIn, setstayIn] = useState("");
  const [stayLocation, setstayLocation] = useState("");
  const [checkInNoOfPersons, setcheckInNoOfPersons] = useState("");
  const [checkOutNoOfPersons, setcheckOutNoOfPersons] = useState("");
  const [checkInTime, setCheckInTime] = useState(new Date());
  const [checkInDate, setCheckInDate] = useState(cdate);
  const [checkOutTime, setCheckOutTime] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(cdate);
  const [showCheckInTimePicker, setShowCheckInTimePicker] = useState(false);
  const [showCheckInDatePicker, setShowCheckInDatePicker] = useState(false);
  const [showCheckOutTimePicker, setShowCheckOutTimePicker] = useState(false);
  const [showCheckOutDatePicker, setShowCheckOutDatePicker] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [serviceDropdownVisible, setserviceDropdownVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const [errors, setErrors] = useState({
    serviceType: false,
    stayIn: false,
    checkInNoOfPersons:false,
    stayLocation: false,
    uploadedFiles: false,
    totalBillAmount:false
  });

  const isUpdateMode =
    route.params?.amount ||
    route.params?.StayLocation ||
    route.params?.StayIn ||
    route.params?.NoOfPerson ||
    route.params?.checkInDate || 
    route.params?.checkInTime|| 
    route.params?.checkOutDate || 
    route.params?.checkOutTime || 
    route.params?.serviceType;


  const serviceOptions = [
    { label: "Paid by Self", value: "Self" },
    { label: "Paid by Organization", value: "Organization" },
  ];

  const selectserviceType = (item) => {
    setserviceType(item);
    setserviceDropdownVisible(false);
    setErrors({ ...errors, serviceType: false });
    if (item.label === "Paid by Self") {
      
    } else {
      setTotalBillAmount("");
      setErrors({ ...errors, totalBillAmount: false });
    }
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
        route.params?.amount ,
      route.params?.StayLocation ,
      route.params?.StayIn ,
      route.params?.NoOfPerson ,
      route.params?.checkInDate , 
      route.params?.checkInTime, 
      route.params?.checkOutDate ,
      route.params?.checkOutTime, 
      route.params?.serviceType,
      title,fromDate,toDate,tourId
      );
      setstayLocation(route.params?.StayLocation)
      setstayIn(route.params?.StayIn)
      setcheckInNoOfPersons(String(route.params?.NoOfPerson))
      
      setCheckInTime(timeStringToDate(route.params?.checkInTime) )
      setCheckInDate(isUpdateMode ? parseDateFromString(route.params?.checkInDate) : new Date())
      setCheckOutTime(timeStringToDate(route.params?.checkOutTime) )
      setCheckOutDate(isUpdateMode ? parseDateFromString(route.params?.checkOutDate) : new Date())
      
      
      const serviceType = serviceOptions.find(
        (option) => option.label == route.params?.serviceType
      );
      selectserviceType(serviceType)
      setTotalBillAmount(String(route.params?.amount));
      setUploadedFiles(route.params?.documents || []);
      console.log("Date",uploadedFiles)
    }
    
  }, []);

  const validateForm = () => {
    const newErrors = {
      serviceType: !serviceType,
      totalBillAmount: serviceType.label==="Paid by Self" && totalBillAmount==="",
      stayLocation: !stayLocation || stayLocation === "",
      stayIn: !stayIn || stayIn === "",
      checkInNoOfPersons:!checkInNoOfPersons,
      uploadedFiles: uploadedFiles.filter((file) => file !== null).length === 0,
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async() => {
    console.log(title,fromDate,toDate,tourId);
    if (validateForm()) {
      const formData = {
        serviceType,
        stayIn,
        stayLocation,
        uploadedFiles,
      };
      console.log("Form Data:", formData);
      
    } else {
      Alert.alert("Form Error", "Please fill all required fields.");
    }

    setLoading(true);
      try{
        console.log("time",checkInTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }))
        const formData = new FormData();
      formData.append("token", EXPENSE_TOKEN);
      formData.append("tour_id", Number(tourId));
      formData.append("employee_id", String(userData.user_code));
      formData.append("accommodation_expense_date", checkInDate.toLocaleDateString("en-GB"));
      formData.append("stay_location", stayLocation);
      formData.append("hotel_name", stayIn);
      formData.append("check_in_no_of_person", String(checkInNoOfPersons));
      formData.append("check_in_date", String(checkInDate.toLocaleDateString("en-GB")));
      formData.append("check_in_time", String(checkInTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })));
      formData.append("check_out_no_of_person", String(checkInNoOfPersons));
      formData.append("check_out_date", String(checkOutDate.toLocaleDateString("en-GB")));
      formData.append("check_out_time", String(checkOutTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })));
      formData.append("service_type", String(serviceType.label));
      formData.append("bill_issue_by", "NoText");
      formData.append("amount", serviceType.label==="Paid by Self" ? String(totalBillAmount) : "0") ;
      formData.append("gst_applicable", 'No');
      formData.append("company_id", '101');
      formData.append("gst_no_submitted", "101");
      formData.append("without_gst_amount", "0");
      formData.append("gst_amount", "0");
      formData.append("state_id", "0");
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
        ? `${EXPENSE_BASE_URL}${TOURACCOUMODATION_EXPENSE_UPDATE_API}`
        : `${EXPENSE_BASE_URL}${TOURACCOUMODATION_EXPENSE_ADD_API}`;

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
  };


  const timeStringToDate = (timeStr)=> {
    // Split the time string into hours and minutes
    const [hours, minutes] = timeStr.split(':').map(Number);

    // Create a new Date object for the current date
    const date = new Date();

    // Set the hours and minutes
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
}
  

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#020242'}}>

    <View style={styles.container}>
    <ExpenseHeader 
                title={isUpdateMode? "Update Accommodation Expenses":"Add Accommodation Expenses" }
                onPress={() => navigation.goBack()}
                showBackArrow={true} />
      

      <ScrollView style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Stay Location</Text>
          <TextInput
            style={[styles.inputRow, errors.stayLocation && styles.errorInput]}
            value={stayLocation}
            placeholder="Location of Traveller"
            onChangeText={(text) => {
              setstayLocation(text);
              setErrors({ ...errors, stayLocation: false });
            }}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Stay In</Text>
          <TextInput
            style={[styles.inputRow, errors.stayIn && styles.errorInput]}
            value={stayIn}
            placeholder="Hotel Name"
            onChangeText={(text) => {
              setstayIn(text);
              setErrors({ ...errors, stayIn: false });
            }}
          />
        </View>

        <View style={styles.formGroup}>
                    <Text style={styles.label}>Check In</Text>
                    <View style={styles.inlineFields}>
                        <TextInput
                            style={[styles.inlineInput, errors.checkInNoOfPersons && styles.errorInput]}
                            placeholder="Attendees"
                            multiline={false}

                            value={checkInNoOfPersons}
                            onChangeText={text => {
                                setcheckInNoOfPersons(text);
                                setErrors({ ...errors, checkInNoOfPersons: false });
                            }}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity
                            style={styles.inlineInput}
                            onPress={() => setShowCheckInTimePicker(true)}
                        >
                            <Text>{checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.inlineInput}
                            onPress={() => setShowCheckInDatePicker(true)}
                        >
                            <Text>{checkInDate.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Check Out</Text>
                    <View style={styles.inlineFields}>
                        <TextInput
                            style={[styles.inlineInput, errors.checkOutNoOfPersons && styles.errorInput]}
                            placeholder="Attendees"
                            value={checkInNoOfPersons}
                            onChangeText={text => {
                                setcheckOutNoOfPersons(text);
                                setErrors({ ...errors, checkOutNoOfPersons: false });
                            }}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity
                            style={styles.inlineInput}
                            onPress={() => setShowCheckOutTimePicker(true)}
                        >
                            <Text>{checkOutTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.inlineInput}
                            onPress={() => setShowCheckOutDatePicker(true)}
                        >
                            <Text>{checkOutDate.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Date & Time Pickers */}
                {showCheckInTimePicker && (
                    <DateTimePicker
                        value={checkInTime}
                        mode="time"
                        display="default"
                        onChange={(event, selectedTime) => {
                            setShowCheckInTimePicker(false);
                            if (selectedTime) setCheckInTime(selectedTime);
                        }}
                    />
                )}
                {showCheckInDatePicker && (
                    <DateTimePicker
                        value={checkInDate}
                        mode="date"
                        display="default"
                        minimumDate={ parseDateFromString(fromDate)}
                        maximumDate={parseDateFromString(toDate)}
                        onChange={(event, selectedDate) => {
                            setShowCheckInDatePicker(false);
                            if (selectedDate) setCheckInDate(selectedDate);
                        }}
                    />
                )}
                {showCheckOutTimePicker && (
                    <DateTimePicker
                        value={checkOutTime}
                        mode="time"
                        display="default"
                        
                        onChange={(event, selectedTime) => {
                            setShowCheckOutTimePicker(false);
                            if (selectedTime) setCheckOutTime(selectedTime);
                        }}
                    />
                )}
                {showCheckOutDatePicker && (
                    <DateTimePicker
                        value={checkOutDate}
                        mode="date"
                        display="default"
                        minimumDate={checkInDate}
                        maximumDate={parseDateFromString(toDate)}
                        onChange={(event, selectedDate) => {
                            setShowCheckOutDatePicker(false);
                            if (selectedDate) setCheckOutDate(selectedDate);
                        }}
                    />
                )}

        {/* service Type */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Service Type</Text>
          <TouchableOpacity
            style={[
              styles.inputRow,
              errors.serviceType && styles.errorInput,
            ]}
            onPress={() =>
              setserviceDropdownVisible(!serviceDropdownVisible)
            }
          >
            {serviceType ? (
              <TextInput
                style={[styles.input, styles.expenseTypeInput]}
                value={serviceType.label}
                editable={false}
              />
            ) : (
              <TextInput
                style={[styles.input, styles.expenseTypeInput]}
                value=""
                placeholder="Select service type"
                placeholderTextColor="#aaa"
                editable={false}
              />
            )}
            <FontAwesome
              name="chevron-down"
              size={24}
              color="#F7B32B"
              style={styles.icon}
            />
          </TouchableOpacity>

          {/* service Dropdown Modal */}
          <Modal
            visible={serviceDropdownVisible}
            transparent={true}
            animationType="fade"
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setserviceDropdownVisible(false)}
            >
              <View style={styles.dropdownContainer}>
                <FlatList
                  data={serviceOptions}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => selectserviceType(item)}
                    >
                      <Text style={styles.dropdownItemText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
        {serviceType?.label === "Paid by Self" && (
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

        {/* File Upload Section */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Upload bills [.pdf, .jpeg, .jpg, .png]
          </Text>
          <FileLoader
            onUpload={(files) => {
              setUploadedFiles(files);
              if (files.filter((file) => file !== null).length > 0) {
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

export default AccommodationForm;
