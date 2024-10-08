import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from "react-native";
import styles from "./ReportScreenStyle";
import DropDownPicker from "react-native-dropdown-picker";
import { Table, Row, TableWrapper, Cell } from "react-native-table-component";
import { useNavigation } from "@react-navigation/native";
import DateFilter from "../../../components/ExpensePageComponents/DateFilter";
import ExpenseHeader from "../../../components/Header/ExpenseHeader";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {
  EXPENSE_BASE_URL,
  EXPENSE_GET_REPORTS_API,
  EXPENSE_TOKEN,
  DOCUMENT_BEARER_TOKEN,
  DOCUMENT_TOKEN_API,
  TOURCONVEYANCE_EXPENSE_DETAILS_API,
  TOURACCOUMODATION_EXPENSE_DETAILS_API,
  TOURFOOD_EXPENSE_DETAILS_API,
  TOUROTHER_EXPENSE_DETAILS_API,
  LOCAL_EXPENSE_DETAILS_API,
  OTHER_EXPENSE_DETAILS_API,
  OFFICE_EXPENSE_DETAILS_API
} from "@env";
import LoadingPopup from "../../../components/LoadingPopup";

const ReportScreen = () => {
  const [typeOpen, setTypeOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [from, setFromDate] = useState(new Date());
  const [to, setToDate] = useState(new Date());
  const [filter, setFilter] = useState("Today");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const handleFilterChange = (from, to, filter) => {
    setFromDate(from);
    setToDate(to);
    setFilter(filter);
  };

  const [typeOptions, setTypeOptions] = useState([
    { label: "Travel", value: "Travel" },
    { label: "Office", value: "Office" },
    { label: "Local Conveyance", value: "Local Conveyance" },
    { label: "Other", value: "Other" },
  ]);

  const [statusOptions, setStatusOptions] = useState([
    { label: "All", value: "All" },
    { label: "In Progress", value: "In Progress" },
    { label: "Approved", value: "Approved" },
    { label: "Rejected", value: "Rejected" },
  ]);

  const tableHead = ["Date", "Type", "Category", "₹", "Status"];

  const navigation = useNavigation();

  const fetchExpenseDetails = async (
    expense_id,
    expense_type,
    expense_title
  ) => {
    try {
      let apiUrl;
      if (expense_type === "Travel") {
        if (expense_title === "Conveyance") {
          apiUrl = `${EXPENSE_BASE_URL}${TOURCONVEYANCE_EXPENSE_DETAILS_API}`;
        } else if (expense_title === "Accommodation") {
          apiUrl = `${EXPENSE_BASE_URL}${TOURACCOUMODATION_EXPENSE_DETAILS_API}`;
        } else if (expense_title === "Food") {
          apiUrl = `${EXPENSE_BASE_URL}${TOURFOOD_EXPENSE_DETAILS_API}`;
        } else {
          apiUrl = `${EXPENSE_BASE_URL}${TOUROTHER_EXPENSE_DETAILS_API}`;
        }
        const response = await axios.post(
          apiUrl,
          {
            token: EXPENSE_TOKEN,
            expense_id: expense_id,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        
        return response.data.formattedData;
      } else if (expense_type === "Local Conveyance") {
        const response = await axios.post(
          `${EXPENSE_BASE_URL}${LOCAL_EXPENSE_DETAILS_API}`,
          {
            token: EXPENSE_TOKEN,
            local_conveyance_id: expense_id,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        return response.data.formattedConveyance;
      } else if (expense_type === "Other"){
        const response = await axios.post(`${EXPENSE_BASE_URL}${OTHER_EXPENSE_DETAILS_API}`, {
          token: EXPENSE_TOKEN,
          other_id:expense_id
      }, {
          headers: { 
              'Content-Type': 'application/x-www-form-urlencoded'
          },
      });
      return response.data.formattedexpense;
      } else {
        const response = await axios.post(`${EXPENSE_BASE_URL}${OFFICE_EXPENSE_DETAILS_API}`, {
          token: EXPENSE_TOKEN,
          office_expense_id: expense_id
      }, {
          headers: { 
              'Content-Type': 'application/x-www-form-urlencoded'
          },
      });

      
      return response.data.formattedofficeexpense;
      }
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
  const handleRowClick = async (rowData) => {
    console.log("ExpenseDetails", { rowData });
    try {
      setLoading(true);

      
      if (rowData.expense_type === "Travel") {
        const conveyanceDetails = await fetchExpenseDetails(
          rowData.expense_id,
          rowData.expense_type,
          rowData.expense_title
        );
      
        const documentToken = await fetchDocumentToken();

        if (conveyanceDetails && rowData.expense_title === "Conveyance") {
          const documents =
            conveyanceDetails.DrishteeTourConveyanceExpenseUploads || [];

          const params = {
            date: String(conveyanceDetails.DrishteeExpense?.expense_date),
            status: String(conveyanceDetails.DrishteeExpense.status),
            category: String(conveyanceDetails.DrishteeExpense.expense_title),
            amount: String(conveyanceDetails.amount),
            billIssuedBy: conveyanceDetails.bill_issue_by
              ? String(conveyanceDetails.bill_issue_by)
              : "-",

            gstApplicable: String(conveyanceDetails.gst_applicable),
            documentAttach: String(conveyanceDetails.documents_attach),

            fromLocation: String(conveyanceDetails.from_location),
            toLocation: String(conveyanceDetails.to_location),
            km: String(conveyanceDetails.distance),

            gstAmount: String(conveyanceDetails.gst_amount),
            withoutGstAmount: String(conveyanceDetails.without_gst_amount),
            ConveyanceDocuments: documents,
            documentToken: documentToken,
            expense_id:rowData.expense_id
          };

          navigation.navigate("ViewExpense", { ...params });
        } else if (conveyanceDetails && rowData.expense_title === "Accommodation") {
          const documents =
            conveyanceDetails.TourExpenseAccommodationUploads || [];

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
            checkInTime: String(conveyanceDetails.check_in_time),
            checkOutDate: String(conveyanceDetails.check_out_date),
            checkOutTime: String(conveyanceDetails.check_out_time),
            serviceType: String(conveyanceDetails.service_type),

            ConveyanceDocuments: documents,
            documentToken: documentToken,
            expense_id:rowData.expense_id
          };

          navigation.navigate("ViewExpense", { ...params });
        } else if (conveyanceDetails && rowData.expense_title === "Food") {
          const documents =
            conveyanceDetails.DrishteeTourFoodExpenseUploads || [];

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
            expense_id:rowData.expense_id
          };

          navigation.navigate("ViewExpense", { ...params });
        } else {
          const documents =
            conveyanceDetails.DrishteeTourOtherExpenseUploads || [];

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
            expense_id:rowData.expense_id
          };

          navigation.navigate("ViewExpense", { ...params });
        }
      } else if ( rowData.expense_type === "Local Conveyance") {
        const conveyanceDetails = await fetchExpenseDetails(
          rowData.local_conveyance_id,
          rowData.expense_type,
          rowData.expense_title
        );
      
        const documentToken = await fetchDocumentToken();
        const documents = conveyanceDetails.conveyanceUploads || [];

        const params = {
          expense_id: conveyanceDetails.DrishteeExpense.expense_id,
          date: String(conveyanceDetails.conveyance_date),
          status: String(conveyanceDetails.DrishteeExpense.status),
          category: String(conveyanceDetails.DrishteeExpense.expense_title),
          amount: String(conveyanceDetails.total_amount),
          billIssuedBy: conveyanceDetails.bill_issue_by
            ? String(conveyanceDetails.bill_issue_by)
            : "-",
          advanceRequired: String(conveyanceDetails.advance_required),
          gstApplicable: String(conveyanceDetails.gst_applicable),
          documentAttach: String(conveyanceDetails.documents_attach),
          location: String(conveyanceDetails.location_name),
          department: String(conveyanceDetails.department_name),
          project: String(conveyanceDetails.project_name),
          fromLocation: String(conveyanceDetails.from_location),
          toLocation: String(conveyanceDetails.to_location),
          km: String(conveyanceDetails.distance_in_km),
          transportMode: String(conveyanceDetails.transport_mode_name),
          transportationType: String(conveyanceDetails.transportation_type),
          ratePerKm: String(conveyanceDetails.rate_per_km),
          gstAmount: String(conveyanceDetails.gst_amount),
          withoutGstAmount: String(conveyanceDetails.without_gst_amount),
          purposeOfVisit: String(conveyanceDetails.visit_purpose),
          ConveyanceDocuments: documents, // Pass the documents array
          documentToken: documentToken,
          
        };

        navigation.navigate("ViewExpense", { ...params });
      } else if (  rowData.expense_type === "Other") {
        const conveyanceDetails = await fetchExpenseDetails(
          rowData.other_id,
          rowData.expense_type,
          rowData.expense_title
        );
      
        const documentToken = await fetchDocumentToken();
        const documents = conveyanceDetails.otherUploads || [];
          console.log(documents);

          const params = {
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
              documentToken: documentToken,
              expense_id:rowData.expense_id
          };

          navigation.navigate('ViewExpense', { ...params });

      } else {
        const conveyanceDetails = await fetchExpenseDetails(
          rowData.office_expense_id,
          rowData.expense_type,
          rowData.expense_title
        );
      
        const documentToken = await fetchDocumentToken();
        if (conveyanceDetails) {
      
          const documents = conveyanceDetails.officeUploads || [];
    
          const params = {
            expense_id:conveyanceDetails.DrishteeExpense.expense_id,
            date: String(conveyanceDetails.office_expense_date),
            status: String(conveyanceDetails.DrishteeExpense.status),
            category: String(conveyanceDetails.DrishteeExpense.expense_title),
            amount: String(conveyanceDetails.expense_amount), 
            documentAttach: String(conveyanceDetails.documents_attach),
            description:String(conveyanceDetails.description),
            ConveyanceDocuments: documents, // Pass the documents array
            dueDate:conveyanceDetails.DrishteeExpense.expense_title==="Rent Expenses" && String(conveyanceDetails.due_date),
            officeLocation: conveyanceDetails.DrishteeExpense.expense_title==="Rent Expenses" && String(conveyanceDetails.office_location),
            officeOwner: conveyanceDetails.DrishteeExpense.expense_title==="Rent Expenses" && String(conveyanceDetails.office_owner),
            expenseType: conveyanceDetails.DrishteeExpense.expense_title==="Other Expenses" && String(conveyanceDetails.other_expense),
            documentToken: documentToken
          };
    
          navigation.navigate('ViewExpense', { ...params });
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]); // Set data to an empty array in case of error
    } finally {
      setLoading(false);
    }
  };

  const screenWidth = Dimensions.get("window").width;

  const handleApply = async () => {
    setLoading(true);
    setData([]);
    try {
      const userData = await SecureStore.getItemAsync("userData");
      const { user_code } = JSON.parse(userData);
      console.log({
        token: EXPENSE_TOKEN,
        employee_id: user_code,
        dateFilter: "Custom",
        customStartDate: from.toLocaleDateString("en-GB"),
        customEndDate: to.toLocaleDateString("en-GB"),
        expensetitle: selectedType,
        status: selectedStatus,
      });
      const response = await axios.post(
        `${EXPENSE_BASE_URL}${EXPENSE_GET_REPORTS_API}`,
        {
          token: EXPENSE_TOKEN,
          employee_id: user_code,
          dateFilter: "Custom",
          customStartDate: from.toLocaleDateString("en-GB"),
          customEndDate: to.toLocaleDateString("en-GB"),
          expensetitle: selectedType,
          status: selectedStatus,
        },
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
      console.log("Data for Reports:", response.data);
      setData(response.data?.Data || []);
    } catch (error) {
      setData([]);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#020242" }}>
      <View style={styles.maincontainer}>
        <ExpenseHeader
          title="Reports"
          onPress={() => navigation.goBack()}
          showBackArrow={true}
        />
        <View style={styles.container}>
          <View style={styles.dropdownContainer}>
            <View style={styles.dropdownWrapper}>
              <DropDownPicker
                open={typeOpen}
                value={selectedType}
                items={typeOptions}
                setOpen={setTypeOpen}
                setValue={setSelectedType}
                setItems={setTypeOptions}
                placeholder="--Type--"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownMenu}
                placeholderStyle={styles.dropdownPlaceholder}
                labelStyle={styles.dropdownLabel}
              />
            </View>
            <View style={styles.dropdownWrapper}>
              <DropDownPicker
                open={statusOpen}
                value={selectedStatus}
                items={statusOptions}
                setOpen={setStatusOpen}
                setValue={setSelectedStatus}
                setItems={setStatusOptions}
                placeholder="--Status--"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownMenu}
                placeholderStyle={styles.dropdownPlaceholder}
                labelStyle={styles.dropdownLabel}
              />
            </View>
          </View>

          <View style={styles.filterContainer}>
            <DateFilter onFilterChange={handleFilterChange} />
          </View>

          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply</Text>
            <LoadingPopup visible={loading} message="Fetching..." />
          </TouchableOpacity>
        </View>

        {/* Table */}
        <View style={styles.tableContainer}>
          <ScrollView horizontal>
            <Table borderStyle={{ borderWidth: 1, borderColor: "#020242" }}>
              <Row
                data={tableHead}
                widthArr={[
                  screenWidth * 0.25,
                  screenWidth * 0.25,
                  screenWidth * 0.3,
                  screenWidth * 0.15,
                  screenWidth * 0.25,
                ]}
                style={styles.head}
                textStyle={styles.headerText}
              />
              {data?.length > 0 ? (
                data?.map((rowData, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleRowClick(rowData)}
                  >
                    <TableWrapper style={styles.row}>
                      <Cell
                        data={rowData.expense_date}
                        width={screenWidth * 0.25}
                        textStyle={{
                          margin: 6,
                          fontSize: 14,
                          color: "#020242",
                          textAlign: "center",
                        }}
                      />
                      <Cell
                        data={rowData.expense_type}
                        width={screenWidth * 0.25}
                        textStyle={{
                          margin: 6,
                          fontSize: 14,
                          color: "#020242",
                          textAlign: "center",
                        }}
                      />
                      <Cell
                        data={rowData.expense_category==="null" ? "-" : rowData.expense_category || "N/A"}
                        width={screenWidth * 0.3}
                        textStyle={{
                          margin: 6,
                          fontSize: 14,
                          color: "#020242",
                          textAlign: "center",
                        }}
                      />
                      <Cell
                        data={`₹${rowData.expense_amount}`}
                        width={screenWidth * 0.15}
                        textStyle={{
                          margin: 6,
                          fontSize: 14,
                          color: "#020242",
                          textAlign: "center",
                        }}
                      />
                      <Cell
                        data={rowData.status}
                        width={screenWidth * 0.25}
                        textStyle={{
                          margin: 6,
                          fontSize: 14,
                          color: "#020242",
                          textAlign: "center",
                        }}
                      />
                    </TableWrapper>
                  </TouchableOpacity>
                ))
              ) : (
                <TableWrapper style={styles.row}>
                  <Cell
                    data="No data available"
                    textStyle={styles.text}
                    width={screenWidth * 1}
                  />
                </TableWrapper>
              )}
            </Table>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ReportScreen;
