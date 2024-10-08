import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import styles from "./ViewExpenseScreenStyle";
import ExpenseHeader from "../../../components/Header/ExpenseHeader";
import { FontAwesome } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import ClarificationCard from "../../../components/ExpensePageComponents/ClarificationCard";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {
  EXPENSE_BASE_URL,
  EXPENSE_GET_CLARIFICATION_API,
  EXPENSE_POST_CLARIFICATION_API,
  EXPENSE_TOKEN,
} from "@env";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import LoadingPopup from "../../../components/LoadingPopup";

const ViewExpenseScreen = ({ navigation, route }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    date,
    status,
    category,
    amount,
    expenseType,
    remarks,
    billIssuedBy,
    advanceRequired,
    gstApplicable,
    documentAttach,
    location,
    department,
    project,
    fromLocation,
    toLocation,
    km,
    transportMode,
    transportationType,
    ratePerKm,
    purposeOfVisit,
    ConveyanceDocuments,
    documentToken,
    dueDate,
    officeLocation,
    description,
    officeOwner,
    StayLocation,
    StayIn,
    NoOfPerson,
    checkInDate,
    checkInTime,
    checkOutDate,
    checkOutTime,
    serviceType,
    foodType,
    expense_id,
  } = route.params || {};

  const [imagePreview, setImagePreview] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [commentDescription, setCommentDescription] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  const handleApply = () => {
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
    setTitle('');
    setCommentDescription('');
    setTitleError(false);
    setDescriptionError(false);
  };

  const handleCommentSubmit= async() =>{
    if (title.trim() === '') {
      setTitleError(true);
    } else {
      setTitleError(false);
    }

    if (commentDescription.trim() === '') {
      setDescriptionError(true);
    } else {
      setDescriptionError(false);
    }
    setLoading(true);
    try {
      const userData = await SecureStore.getItemAsync('DrishteeuserData');
      const { user_code } = JSON.parse(userData);
      console.log(title,commentDescription)
      const formData = new FormData();
      formData.append("token", "b3ebc7cbffd93a61b3ddafc37706dd47");
      formData.append("employee_id", user_code);
      formData.append("expense_id", expense_id);
      formData.append("comment", commentDescription);
      formData.append("comment_title", title);
      console.log("Payload:", `${EXPENSE_BASE_URL}/comments/addComments`,
       formData,)
      const response = await axios.post(
        `${EXPENSE_BASE_URL}/comments/addComments`,
        formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            
        },
        maxBodyLength: Infinity, }
      );
      console.log("Comment Result",response)
      
      fetchData()
      handleClose()
      
    } catch (error) {
      console.log("Error response:", error.response);
      setLoading(false);
    } finally {
      setLoading(false);
    }

  }

  const renderDocuments = () => {
    return ConveyanceDocuments.map((doc, index) => {
      const isImage = /\.(jpeg|jpg|png)$/i.test(doc.bill);

      return (
        <View key={index} style={styles.fileContainer}>
          {isImage ? (
            <TouchableOpacity
              onPress={() => setImagePreview(doc.bill + "?" + documentToken)}
            >
              <Image
                source={{ uri: doc.bill + "?" + documentToken }}
                style={styles.billImage}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => Linking.openURL(doc.bill + "?" + documentToken)}
            >
              <FontAwesome name="file-pdf-o" size={40} color="#FF0000" />
            </TouchableOpacity>
          )}
        </View>
      );
    });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${EXPENSE_BASE_URL}${EXPENSE_GET_CLARIFICATION_API}`,
        {
          token: EXPENSE_TOKEN,
          expense_id,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log("Report Data", response.data?.comments);
      setData(response.data?.comments);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const renderRow = (label, value) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCellLabel}>{label}</Text>
      <Text style={styles.tableCellValue}>{value}</Text>
    </View>
  );


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#020242" }}>
      <View style={styles.maincontainer}>
        <ExpenseHeader
          title="Details"
          onPress={() => navigation.goBack()}
          showBackArrow={true}
        />
        <ScrollView style={styles.container}>
          <View style={styles.section}>
            {renderRow("Category:", category)}
            {renderRow("Amount:", `₹${amount || "0.00"}`)}
            {renderRow("Date:", date || "N/A")}
            {renderRow("Status:", status || "N/A")}
            {expenseType && renderRow("Expense Type:", expenseType)}
            {remarks && renderRow("Remarks:", remarks)}
            {location && renderRow("Location:", location)}
            {department && renderRow("Department:", department)}
            {project && renderRow("Project:", project)}
            {fromLocation && renderRow("From Location:", fromLocation)}
            {toLocation && renderRow("To Location:", toLocation)}
            {km && renderRow("K.M.:", km)}
            {transportMode && renderRow("Mode of Transport:", transportMode)}
            {transportationType &&
              renderRow("Transportation Type:", transportationType)}
            {ratePerKm && renderRow("Rate per K.M.:", ratePerKm)}
            {billIssuedBy && renderRow("Bill Issued By:", billIssuedBy)}
            {advanceRequired &&
              renderRow("Advance Required (INR):", `₹${advanceRequired}`)}
            {gstApplicable && renderRow("GST Applicable:", gstApplicable)}
            {purposeOfVisit && renderRow("Purpose of Visit:", purposeOfVisit)}
            {description && renderRow("Description:", description)}
            {dueDate && renderRow("Due Date:", dueDate)}
            {officeLocation && renderRow("Office Location:", officeLocation)}
            {officeOwner && renderRow("Office Owner:", officeOwner)}
            {StayLocation && renderRow("Stay Location:", StayLocation)}
            {StayIn && renderRow("Stay Inn:", StayIn)}
            {NoOfPerson && renderRow("No. of Person:", NoOfPerson)}
            {checkInDate && renderRow("Check In Date:", checkInDate)}
            {checkInTime && renderRow("Check In Time:", checkInTime)}
            {checkOutDate && renderRow("Check Out Date:", checkOutDate)}
            {checkOutTime && renderRow("Check Out Time:", checkOutTime)}
            {serviceType && renderRow("Service Type:", serviceType)}
            {foodType && renderRow("Food Type:", foodType)}
            {documentAttach && renderRow("Document Attach:", documentAttach)}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bills</Text>
            <View style={styles.documentsRow}>{renderDocuments()}</View>
          </View>

          {status === "Rejected" && (
            <>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApply}
              >
                <Text style={styles.applyButtonText}>
                  Neeed more Clarification
                </Text>
              </TouchableOpacity>
              <View style={styles.ClarificationContainer}>
                {loading && !data?.length ? (
                  <ActivityIndicator size="large" color="#FFCC00" />
                ) : data?.length > 0 ? (
                  <>
                    {data?.map((item, index) => (
                      <ClarificationCard
                        key={index}
                        name={item.added_by}
                        title={item.comment_title || "Clarification"}
                        date={item.dateadded}
                        time={item.time}
                        description={item.comment}
                      />
                    ))}
                  </>
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <Text style={styles.noDataText}>No data available</Text>
                  </View>
                )}
              </View>
            </>
          )}
          <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Need for clarification</Text>
              <TouchableOpacity onPress={handleClose}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Input fields with validation */}
            <TextInput
              style={[styles.input, titleError && styles.errorInput]}
              placeholder="Enter title"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setTitleError(false);
              }}
            />
            {titleError && <Text style={styles.errorText}>Title is required</Text>}

            <TextInput
              style={[styles.textArea, descriptionError && styles.errorInput]}
              placeholder="Enter description"
              value={commentDescription}
              onChangeText={(text) => {
                setCommentDescription(text);
                setDescriptionError(false); 
              }}
              multiline={true}
              numberOfLines={4}
            />
            {descriptionError && <Text style={styles.errorText}>Description is required</Text>}

            <TouchableOpacity style={styles.submitButton} onPress={handleCommentSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
              <LoadingPopup visible={loading} message="Submitting..." />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

          <Modal
            transparent={true}
            visible={!!imagePreview}
            animationType="fade"
            onRequestClose={() => setImagePreview(null)}
          >
            <View style={styles.previewOverlay}>
              <TouchableOpacity
                style={styles.previewCloseButton}
                onPress={() => setImagePreview(null)}
              >
                <FontAwesome name="times" size={24} color="#fff" />
              </TouchableOpacity>
              <Image
                source={{ uri: imagePreview }}
                style={styles.fullImagePreview}
                resizeMode="contain"
              />
            </View>
          </Modal>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ViewExpenseScreen;
