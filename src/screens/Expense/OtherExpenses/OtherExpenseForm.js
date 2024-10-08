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
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "./OtherExpenseFormStyle";
import SubmitButton from "../../../components/CustomButton1"
import ExpenseHeader  from '../../../components/Header/ExpenseHeader';

import FileLoader from "../../../components/ExpensePageComponents/FileLoader";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {
  OTHEREXPENSE_MOT_URL,
  OTHER_EXPENSE_ADD_API,
  EXPENSE_BASE_URL,
  OTHER_EXPENSE_UPDATE_API,
  EXPENSE_TOKEN
} from "@env";
import LoadingPopup from "../../../components/LoadingPopup";
import * as FileSystem from "expo-file-system";

const OtherExpenseForm = ({ navigation, route }) => {
  const [billDate, setBillDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expenseType, setexpenseType] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [totalBillAmount, setTotalBillAmount] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [expenseOptions, setExpenseOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const [errors, setErrors] = useState({
    billDate: false,
    expenseType: false,
    remarks: false,
    totalBillAmount: false,
    uploadedFiles: false,
  });

  const isUpdateMode =
    route.params?.totalBillAmount ||
    route.params?.expenseType ||
    route.params?.billDate ||
    route.params?.documents ||
    route.params?.remarks;

  const mapIconToExpense = (expenseName) => {
    switch (expenseName) {
      case "Cell Phone":
        return require("../../../assets/Expense/PhoneExp.png");
      case "Electricity Expenses":
        return require("../../../assets/Expense/ElectricityExp.png");
      case "Fax Postage and courier":
        return require("../../../assets/Expense/FaxExp.png");
      case "Internet Charges":
        return require("../../../assets/Expense/InternetExp.png");
      case "Laptop Reimbursement":
        return require("../../../assets/Expense/LaptopExp.png");
      case "Printing and Stationery":
        return require("../../../assets/Expense/PrintingExp.png");
      case "Repair and Maintenance Computer":
        return require("../../../assets/Expense/LaptopRepairExp.png");
      case "Repair and Maintenance Motor Car":
        return require("../../../assets/Expense/CarRepairExp.png");
      case "Repair and Maintenance Office":
        return require("../../../assets/Expense/OfficeExp.png");
      case "Staff Welfare Expenses":
        return require("../../../assets/Expense/StaffExp.png");
      case "Training Expenses":
        return require("../../../assets/Expense/TrainingExp.png");
      default:
        return require("../../../assets/Expense/other.png");
    }
  };

  const fetchExpenseOptions = async (userData) => {
    try {
      if (!userData || !userData.token) {
        console.error(
          "Token or user data is missing, unable to fetch expense options."
        );
        return;
      }

      const response = await axios.post(
        `${OTHEREXPENSE_MOT_URL}`,
        {
          drishteeMtoken: userData.token,
          user_code: userData.user_code.toString(),
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const mappedOptions = response.data.data?.map((option) => ({
        ...option,
        label: option.subledger_name,
        id: option.subledger_id,
        icon: mapIconToExpense(option.subledger_name),
      }));

      setExpenseOptions(mappedOptions);
      setIsDataFetched(true);
    } catch (error) {
      console.error("Failed to fetch expense options:", error);
    }
  };

  const getUserData = async () => {
    try {
      const userDataString = await SecureStore.getItemAsync("userData");
      if (userDataString) {
        const data = JSON.parse(userDataString);
        setUserData(data);
        fetchExpenseOptions(data);
      } else {
        console.error("No user data found in SecureStore");
      }
    } catch (error) {
      console.error("Error retrieving user data:", error.message);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);
  useEffect(() => {
    if (isUpdateMode && isDataFetched) {
      console.log(
        route.params?.billDate,
        route.params?.remarks,
        route.params?.documents
      );
      setBillDate(
        isUpdateMode ? parseDateFromString(route.params?.billDate) : new Date()
      );
      const selectedExpense = expenseOptions.find(
        (option) => option.id == route.params?.expenseType
      );
      setexpenseType(selectedExpense);
      setRemarks(route.params?.remarks);
      setTotalBillAmount(route.params?.totalBillAmount);
      setUploadedFiles(route.params?.documents || []);
    }
  }, [isUpdateMode, isDataFetched, expenseOptions]);

  const handleDateChange = (event, selectedDate) => {
    console.log(selectedDate);
    const currentDate = selectedDate || billDate;
    setShowDatePicker(false);
    setBillDate(currentDate);
  };

  const selectExpenseType = (item) => {
    setexpenseType(item);
    setDropdownVisible(false);
    setErrors({ ...errors, expenseType: false });

    if (item.label === "Cell Phone") {
      setTotalBillAmount("250.00");
    } else {
      setTotalBillAmount("");
    }
  };

  const validateForm = () => {
    const newErrors = {
      billDate: !billDate || billDate.toString() === "Invalid Date",
      expenseType: !expenseType,
      remarks: !remarks,
      totalBillAmount:
        !totalBillAmount ||
        isNaN(parseFloat(totalBillAmount)) ||
        parseFloat(totalBillAmount) <= 0,
      uploadedFiles:
        expenseType?.label !== "Cell Phone" &&
        expenseType?.label !== "Laptop Reimbursement" &&
        uploadedFiles.filter((file) => file !== null).length === 0,
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Form Error", "Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("token", EXPENSE_TOKEN);
      formData.append("employee_id", String(userData.user_code));
      formData.append("date", billDate.toLocaleDateString("en-GB"));
      formData.append("expense_type", String(expenseType.id));
      formData.append("amount", String(totalBillAmount));
      formData.append("gst_applicable", "No");
      
      formData.append("remarks", remarks);
     
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
        formData.append("other_id", route.params?.other_id); 
      }
      console.log(formData);

      const apiUrl = isUpdateMode
        ? `${EXPENSE_BASE_URL}${OTHER_EXPENSE_UPDATE_API}`
        : `${EXPENSE_BASE_URL}${OTHER_EXPENSE_ADD_API}`;

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
      navigation.navigate("OtherExpense");
    } catch (error) {
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
  const getMinimumDate = () => {
    const today = new Date();
    const currentDay = today.getDate();
    if (currentDay <= 7) {
      return new Date(today.getFullYear(), today.getMonth() - 1, 1);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  };

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#020242'}}>
    <View style={styles.container}>
      <ExpenseHeader 
                title={isUpdateMode? "Update Other Expense":"Add Other Expense" }
                onPress={() => navigation.goBack()}
                showBackArrow={true} />

      <ScrollView style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Bill Date</Text>
          <TouchableOpacity
            style={styles.inputRow}
            onPress={() => setShowDatePicker(true)}
          >
            <TextInput
              style={[styles.input, errors.billDate && styles.errorInput]}
              value={
                isUpdateMode
                  ? formatDateToString(billDate)
                  : billDate.toLocaleDateString("en-GB")
              }
              editable={false}
            />
            <FontAwesome
              name="calendar"
              size={24}
              color="#F7B32B"
              style={styles.icon}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={billDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
              minimumDate={getMinimumDate()}
            />
          )}
        </View>

        {/* Mode Of Transport */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Selet Expense Type</Text>
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
            <FontAwesome
              name="chevron-down"
              size={24}
              color="#F7B32B"
              style={styles.icon}
            />
          </TouchableOpacity>

          {/* Dropdown Modal */}
          <Modal
            visible={dropdownVisible}
            transparent={true}
            animationType="fade"
          >
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

        <View style={styles.formGroup}>
          <Text style={styles.label}>Remarks</Text>
          <TextInput
            style={[styles.remarksInput, errors.remarks && styles.errorInput]}
            value={remarks}
            onChangeText={(text) => {
              setRemarks(text);
              setErrors({ ...errors, remarks: false });
            }}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Total Bill Amount</Text>
          <TextInput
            style={[
              styles.inputRow,
              errors.totalBillAmount && styles.errorInput,
            ]}
            value={totalBillAmount}
            placeholder="Total Amount"
            keyboardType="numeric"
            editable={expenseType?.label !== "Cell Phone"}
            onChangeText={(text) => {
              setTotalBillAmount(text);
              setErrors({ ...errors, totalBillAmount: false });
            }}
          />
        </View>

        {/* File Upload Section */}
        {expenseType?.label !== "Cell Phone" &&
          expenseType?.label !== "Laptop Reimbursement" && (
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
          )}

<SubmitButton title={isUpdateMode? "Update":"Submit" } loading={loading}
 onPress={handleSubmit}/>
<LoadingPopup visible={loading} message="Submitting..." />
      </ScrollView>
    </View>
    </SafeAreaView>
  );
};

export default OtherExpenseForm;
