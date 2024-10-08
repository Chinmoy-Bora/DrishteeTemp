import React, {useState, useEffect} from "react";
import { View, Text, Image, ScrollView, TouchableOpacity,SafeAreaView,StatusBar, ImageBackground,ActivityIndicator   } from "react-native";
import styles from "./ExpenseBaseScreenStyle";
import RectangleButton from "../../components/ExpensePageComponents/RectangleButton";
import KnowExpensesCard from "../../components/ExpensePageComponents/KnowExpensesCard";
import ExpenseCard from "../../components/ExpensePageComponents/ExpenseCard";
import { FontAwesome } from "@expo/vector-icons";
import Header from "../../components/Header/Header";
import DateFilter from "../../components/ExpensePageComponents/DateFilter";
import LoadMoreButton from "../../components/ExpensePageComponents/LoadMoreButton";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { EXPENSE_BASE_URL, EXPENSE_GET_STATISTICS_API, EXPENSE_TOKEN, LIMIT } from '@env';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import LoadingPopup from "../../components/LoadingPopup";

const ExpenseBaseScreen = ({ navigation }) => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [filter,setFilter]=useState("Today")
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true)
  const [travelData,setTravelData]=useState([])
  const [otherData,setOtherData]=useState([])
  const [localData,setLocalData]=useState([])

  const handleFilterChange = (from, to,filter) => {
    setFromDate(from);
    setToDate(to);
    setFilter(filter)
    fetchData(from, to,filter); 
  };

  const fetchData = async (from, to,filter="Today") => {
    setLoading(true);
    

    try {

      const userData = await SecureStore.getItemAsync('DrishteeuserData');
      const { user_code } = JSON.parse(userData);
      console.log("Data to send:", from.toLocaleDateString("en-GB"), to.toLocaleDateString("en-GB"),filter)
      const response=await axios.post(`${EXPENSE_BASE_URL}${EXPENSE_GET_STATISTICS_API}`,{
          token: EXPENSE_TOKEN,
          employee_id:user_code,
          dateFilter:'Custom',
          customStartDate:from.toLocaleDateString("en-GB"),
          customEndDate:to.toLocaleDateString("en-GB"),
      },{
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      })
      
      if(response.status===200){
        setTravelData(response.data?.Data["Travel"] || [])
        setLocalData(response.data?.Data["Local"] || [])
        setOtherData(response.data?.Data["Other"] || [])
      }
      

    
    } catch (error) {
      
      setTravelData([])
      setLocalData([])
      setOtherData([])
    } finally {
      setLoading(false);
    }
  };

 
  useFocusEffect(
    useCallback(() => {
      handleFilterChange(new Date(), new Date(), 'Today')
      
    }, [])
  );


  return (
    <SafeAreaView  style={{ flex: 1, backgroundColor:'#000' }}>
       <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.container}>
      <ScrollView>
      
      {/* <Header 
                title="Expense Dashboard" 
                onPress={onPress}
                showBackArrow={false} /> */}
       <View style={styles.header}> 
       <Image source={require("../../assets/Expense/four-circle.png")} style={styles.image}/>

        <Text style={styles.headerTitle}> Dashboard</Text>
        {/* <TouchableOpacity> 
          <Image
            source={require("../../assets/info.png")}
            style={styles.iconinfo}
          />
        </TouchableOpacity> */} 
      </View>

      <ScrollView style={styles.content}>
        {/* <ImageBackground style={styles.backgroundImage} source={require('../../assets/Expense/backexpense.jpg')}  /> */}

        <View style={styles.section}>

        <Text style={styles.sectionTitle}>Expenses</Text>

          <Text style={styles.sectionsubTitle}>Submit the expenses you've covered out of your own pocket !</Text>
          <View style={styles.buttonBox}>
            <RectangleButton
              imageSource={require("../../assets/Expense/travel.png")}
              text="Travel expenses"
              backgroundColor="#fff"
              tintColor="#020242"
              color="#000"

              onPress={() => navigation.navigate('TravelExpense')}
            />
            <RectangleButton
              imageSource={require("../../assets/Expense/local.png")}
              text="Local conveyance"
              backgroundColor="#fff"
              tintColor="#020242"
              color="#000"

              onPress={() => navigation.navigate('LocalConveyance')}
            />
            <RectangleButton
              imageSource={require("../../assets/Expense/others.png")}
              text="Other expenses"
              backgroundColor="#fff"
              tintColor="#020242"
              color="#000"

              onPress={() => navigation.navigate('OtherExpense')}
            />
          <RectangleButton
            imageSource={require("../../assets/Expense/office.png")}
            text="Office expenses"
            backgroundColor="#fff"
            tintColor="#020242"//f5f5dc
            color="#000"

            onPress={() => navigation.navigate('OffieExpense')}
          />
                    {/* </View>
                    <View style={styles.buttonBox1}> */}

          
          
        </View>
       
        </View>

        <KnowExpensesCard
       
          

            onPress={() => navigation.navigate('Statistics')}
          />

        <View style={styles.expensesContainer}>
          <View style={styles.expensesHeader}>
            <Text style={styles.expensesTitle}>Data For You</Text>
            <DateFilter onFilterChange={handleFilterChange} />
          </View>

              <ExpenseCard
            color="#020242"
              title="Pending for Confirmation"
              travelAmount= {travelData["In Progress"]?.totalAmount || "0"}
              localConveyanceAmount={localData["In Progress"]?.totalAmount || "0"}
              otherAmount={otherData["In Progress"]?.totalAmount || "0"}
            />
          <ExpenseCard
            color="#007218"
            title="Account for"
            travelAmount={travelData["Approved"]?.totalAmount || "0"}
            localConveyanceAmount={localData["Approved"]?.totalAmount || "0"}
            otherAmount={otherData["Approved"]?.totalAmount || "0"}
          />
          <ExpenseCard
            color="#FF0000"
            title="Rejected"
            travelAmount={travelData["Rejected"]?.totalAmount || "0"}
            localConveyanceAmount={localData["Rejected"]?.totalAmount || "0"}
            otherAmount={otherData["Rejected"]?.totalAmount || "0"}
          />
        </View>
        <LoadingPopup visible={loading} message="Fetching..." />
      </ScrollView>
    </ScrollView>

      </View>
      
    </SafeAreaView >
  );
};

export default ExpenseBaseScreen;
