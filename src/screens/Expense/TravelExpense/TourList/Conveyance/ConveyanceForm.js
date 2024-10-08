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
import styles from "./ConveyanceFormStyle";
import FileLoader from "../../../../../components/ExpensePageComponents/FileLoader";
import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import {LOCALCONVEYANCE_MOT_URL,EXPENSE_TOKEN, EXPENSE_BASE_URL,TOURCONVEYANCE_EXPENSE_ADD_API ,TOURCONVEYANCE_EXPENSE_UPDATE_API} from '@env'
import * as FileSystem from "expo-file-system";

// Import your local icons
import carIcon from '../../../../../assets/Expense/car.png';
import autoIcon from '../../../../../assets/Expense/auto.png';
import bikeIcon from '../../../../../assets/Expense/twoWheeler.png';
import busIcon from '../../../../../assets/Expense/bus.png';
import metroIcon from '../../../../../assets/Expense/metro.png';
import rickshawIcon from '../../../../../assets/Expense/rickshaw.png';
import taxiIcon from '../../../../../assets/Expense/taxi.png';
import trainIcon from '../../../../../assets/Expense/train.png'; 
import planeIcon from '../../../../../assets/Expense/plane.png'; 
import otherIcon from '../../../../../assets/Expense/other.png'; 
import LoadingPopup from "../../../../../components/LoadingPopup";

const ConveyanceForm = ({ navigation,route }) => {
    const { title,fromDate,toDate,tourId }=route.params;

    const parseDateFromString = (dateString) => {
   
      const [day, month, year] = dateString.split("/").map(Number);
      
      return new Date(year, month - 1, day); 
    };
    const cdate=parseDateFromString(fromDate)
    
  const [billDate, setBillDate] = useState(cdate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expenseOptions, setExpenseOptions] = useState([]);
  const [selectedModeOfTransport, setSelectedModeOfTransport] = useState(null);
  const [totalBillAmount, setTotalBillAmount] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [transportationType, setTransportationType] = useState(null);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [kmTravelled, setKmTravelled] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);

  

  const [transportationDropdownVisible, setTransportationDropdownVisible] = useState(false);
  const [errors, setErrors] = useState({
    billDate: false,
    selectedModeOfTransport: false,
    transportationType: false,
    kmTravelled: false,
    totalBillAmount: false,
    fromLocation:false,
    toLocation:false,
    uploadedFiles: false,
  });

  const isUpdateMode =
    route.params?.totalBillAmount ||
    route.params?.modeOfTransport ||
    route.params?.billDate ||
    route.params?.documents ||
    route.params?.remarks || 
    route.params?.transportType|| 
    route.params?.fromLocation || 
    route.params?.toLocation || 
    route.params?.kmTravelled;

 

  const transportationOptions = [
    { label: "Public", value: "Public" },
    { label: "Personal", value: "Personal" },
  ];

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || billDate;
    setShowDatePicker(false);
    setBillDate(currentDate);
  };

  const mapIconToTransport = (conve_name) => {
    switch (conve_name) {
      case '4-Wheeler': return carIcon;
      case 'Auto': return autoIcon;
      case 'Bike/Scooter': return bikeIcon;
      case 'Bus': return busIcon;
      case 'Metro Rail': return metroIcon;
      case 'Rickshaw': return rickshawIcon;
      case 'Taxi/Cab': return taxiIcon;
      case 'Train': return trainIcon;
      case 'Plane': return planeIcon;
      default: return otherIcon;
    }
  };

const fetchExpenseOptions = async (token) => {
  try {
    if (!token) {
      console.error('Token is missing, unable to fetch expense options.');
      return;
    }

    
    const response = await axios.get(
      `${LOCALCONVEYANCE_MOT_URL}`,
      {
        headers: {
          'drishteeMtoken': token,
        },
      }
    );

    const mappedOptions = response.data.data?.map((option) => ({
      ...option,
      label: option.conve_name,
      id: option.conve_id,
      icon: mapIconToTransport(option.conve_name),
    }));

    setExpenseOptions(mappedOptions);
    setIsDataFetched(true);
  } catch (error) {
    console.error('Failed to fetch transportation options:', error);
  }
};

const getUserData = async () => {
  try {
    const data = await SecureStore.getItemAsync('DrishteeuserData');
    if (data) {
      const parsedData = JSON.parse(data);
      setUserData(parsedData);
      fetchExpenseOptions(parsedData.token);
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
  if (isUpdateMode && isDataFetched) {
    console.log("Data from the Local Expense",
      route.params?.totalBillAmount ,
    route.params?.modeOfTransport ,
    route.params?.billDate ,
    route.params?.documents ,
    route.params?.remarks , 
    route.params?.transportType, 
    route.params?.fromLocation ,
    route.params?.toLocation, 
    route.params?.kmTravelled,
    title,fromDate,toDate,tourId
    );
    setBillDate(
      isUpdateMode ? parseDateFromString(route.params?.billDate) : new Date()
    );
    const selectMOT = expenseOptions.find(
      (option) => option.id == route.params?.modeOfTransport
    );
    setSelectedModeOfTransport(selectMOT);
    const TransportType = transportationOptions.find(
      (option) => option.value == route.params?.transportType
    );
    selectTransportationType(TransportType)
    setFromLocation(route.params?.fromLocation);
    setToLocation(route.params?.toLocation);
    setKmTravelled(route.params?.kmTravelled)
    setTotalBillAmount(String(route.params?.totalBillAmount));
    setUploadedFiles(route.params?.documents || []);
  }
}, [isUpdateMode, isDataFetched, expenseOptions]);

  const selectModeOfTransport = (item) => {
    setSelectedModeOfTransport(item);
    setDropdownVisible(false);
    setErrors({ ...errors, selectedModeOfTransport: false });
  };

  const selectTransportationType = (item) => {
    setTransportationType(item);
    setTransportationDropdownVisible(false);
    setErrors({ ...errors, transportationType: false });
  };

  useEffect(() => {
    if (transportationType?.value === "Personal" && selectedModeOfTransport) {
      let ratePerKm = 0;
      if (selectedModeOfTransport.label === "4-Wheeler") {
        ratePerKm = 8;
      } else if (selectedModeOfTransport.label === "Bike/Scooter") {
        ratePerKm = 4;
      }

      const km = parseFloat(kmTravelled);
      if (!isNaN(km) && km > 0) {
        setTotalBillAmount((km * ratePerKm).toFixed(2));
      } else {
        setTotalBillAmount("");
      }
    }
  }, [kmTravelled, selectedModeOfTransport, transportationType]);

  const validateForm = () => {
    const isPersonal = transportationType?.value === "Personal";
    const isPublic = transportationType?.value === "Public";
    
  
    const newErrors = {
      billDate: !billDate || billDate.toString() === "Invalid Date",
      selectedModeOfTransport: !selectedModeOfTransport,
      transportationType: (selectedModeOfTransport?.label!=="Bus" && selectedModeOfTransport?.label!=="Bike/Scooter" && selectedModeOfTransport?.label!=="Metro Rail" && selectedModeOfTransport?.label!=="Plane" && selectedModeOfTransport?.label!=="Rickshaw" && selectedModeOfTransport?.label!=="Train") && !transportationType,
      kmTravelled: (selectedModeOfTransport?.label!=="Metro Rail" && selectedModeOfTransport?.label!=="Plane" && selectedModeOfTransport?.label!=="Train") &&(!kmTravelled || isNaN(parseFloat(kmTravelled)) || parseFloat(kmTravelled) <= 0),
      totalBillAmount: isPersonal
        ? !totalBillAmount || isNaN(parseFloat(totalBillAmount)) || parseFloat(totalBillAmount) <= 0
        : !totalBillAmount || isNaN(parseFloat(totalBillAmount)) || parseFloat(totalBillAmount) <= 0,
      toLocation:!toLocation || toLocation==="",
      fromLocation:!fromLocation || fromLocation==="",
      uploadedFiles: uploadedFiles.filter(file => file !== null).length === 0,
    };
  
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };
  
  

  const handleSubmit = async() => {
    if (validateForm()) {
      
      const data = {
        billDate: billDate.toLocaleDateString("en-GB"),
        selectedModeOfTransport,
        transportationType,
        fromLocation,
        toLocation,
        kmTravelled,
        totalBillAmount,
        uploadedFiles,
      };
      setLoading(true);
      try{
        let tp=transportationType?.value;
        if(selectedModeOfTransport.label==="Bus" || selectedModeOfTransport.label==="Bike/Scooter" || selectedModeOfTransport.label==="Metro Rail" || selectedModeOfTransport.label==="Plane" || selectedModeOfTransport.label==="Rickshaw" || selectedModeOfTransport.label==="Train"){
          tp="Public"
        }
        if(selectedModeOfTransport?.label==='Train' || selectedModeOfTransport?.label==='Plane' || selectedModeOfTransport?.label==='Metro Rail' ){
          setKmTravelled(0)
        }

        const formData = new FormData();
      formData.append("token", EXPENSE_TOKEN);
      formData.append("tour_id", Number(tourId));
      formData.append("employee_id", String(userData.user_code));
      formData.append("conveyance_expense_date", billDate.toLocaleDateString("en-GB"));
      formData.append("from_location", fromLocation);
      formData.append("to_location", toLocation);
      formData.append("distance", String(kmTravelled));
      formData.append("conveyance_mode", String(selectedModeOfTransport.id));
      formData.append("conveyance_hire", tp==null ? "Public" : tp);
      formData.append("amount", String(totalBillAmount));
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
        ? `${EXPENSE_BASE_URL}${TOURCONVEYANCE_EXPENSE_UPDATE_API}`
        : `${EXPENSE_BASE_URL}${TOURCONVEYANCE_EXPENSE_ADD_API}`;

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
      Alert.alert("Form Error", "Please fill all the fields.");
      return;

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
                title={isUpdateMode? "Update Conveyance Expenses":"Add Conveyance Expenses" }
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
                : billDate.toLocaleDateString("en-GB")}
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
          <Text style={styles.label}>Conveyance Mode</Text>
          <TouchableOpacity style={[styles.inputRow, errors.selectedModeOfTransport && styles.errorInput]} onPress={() => setDropdownVisible(!dropdownVisible)}>
            {selectedModeOfTransport ? (
              <>
                <Image source={selectedModeOfTransport.icon} style={styles.iconImage} />
                <TextInput
                  style={[styles.input, styles.expenseTypeInput]}
                  value={selectedModeOfTransport.label}
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
                    <TouchableOpacity style={styles.dropdownItem} onPress={() => selectModeOfTransport(item)}>
                      <Image source={item.icon} style={styles.iconImage} />
                      <Text style={styles.dropdownItemText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        </View>

        {/* Transportation Type */}
        {selectedModeOfTransport?.label !== 'Bike/Scooter' &&
  selectedModeOfTransport?.label !== 'Bus' &&
  selectedModeOfTransport?.label !== 'Metro Rail' &&
  selectedModeOfTransport?.label !== 'Plane' &&
  selectedModeOfTransport?.label !== 'Rickshaw' &&
  selectedModeOfTransport?.label !== 'Train' && (
          <View style={styles.formGroup}>
          <Text style={styles.label}>Conveyance Hire</Text>
          <TouchableOpacity
            style={[styles.inputRow, errors.transportationType && styles.errorInput]}
            onPress={() => setTransportationDropdownVisible(!transportationDropdownVisible)}
          >
            {transportationType ? (
              <TextInput
                style={[styles.input, styles.expenseTypeInput]}
                value={transportationType.label}
                editable={false}
              />
            ) : (
              <TextInput
                style={[styles.input, styles.expenseTypeInput]}
                value=""
                placeholder="Select transportation type"
                placeholderTextColor="#aaa"
                editable={false}
              />
            )}
            <FontAwesome name="chevron-down" size={24} color="#F7B32B" style={styles.icon} />
          </TouchableOpacity>

          {/* Transportation Dropdown Modal */}
          <Modal visible={transportationDropdownVisible} transparent={true} animationType="fade">
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setTransportationDropdownVisible(false)}
            >
              <View style={styles.dropdownContainer}>
                <FlatList
                  data={transportationOptions}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.dropdownItem} onPress={() => selectTransportationType(item)}>
                      <Text style={styles.dropdownItemText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
        )}
        

        <View style={styles.formGroup}>
          <Text style={styles.label}>From Location</Text>
          <TextInput
            style={[styles.inputRow, errors.fromLocation && styles.errorInput]}
            value={fromLocation}
            placeholder="Start Location"
            onChangeText={(text) => {
              setFromLocation(text);
              setErrors({ ...errors, fromLocation: false });
            }}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>To Location</Text>
          <TextInput
            style={[styles.inputRow, errors.toLocation && styles.errorInput]}
            value={toLocation}
            placeholder="End Location"
            onChangeText={(text) => {
              setToLocation(text);
              setErrors({ ...errors, toLocation: false });
            }}
          />
        </View>

        {
          selectedModeOfTransport?.label!=='Train' && selectedModeOfTransport?.label!=='Plane' && selectedModeOfTransport?.label!=='Metro Rail' &&(
<View style={styles.formGroup}>
          <Text style={styles.label}>Distance</Text>
          <TextInput
            style={[styles.inputRow, errors.kmTravelled && styles.errorInput]}
            value={kmTravelled}
            placeholder="Total Distance in (kilo meter)"
            keyboardType="numeric"
            onChangeText={(text) => {
              setKmTravelled(text);
              setErrors({ ...errors, kmTravelled: false });
            }}
            
          />
        </View>
          )
        }
        

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
            editable={!(transportationType?.value === "Personal" && 
                        (selectedModeOfTransport?.label === "4-Wheeler" || 
                        selectedModeOfTransport?.label === "Bike/Scooter"))}
          />
        </View>


        {/* File Upload Section */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Upload bills [.pdf, .jpeg, .jpg, .png]</Text>
          {selectedModeOfTransport?.label==="Plane" &&(<Text style={styles.label}>Invoice/Ticket & Boarding Pass -both to be attached</Text>)}
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

export default ConveyanceForm;
