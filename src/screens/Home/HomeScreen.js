import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, Platform, SafeAreaView, StatusBar, Alert } from "react-native";
import styles from "./HomeScreenStyle";
import * as SecureStore from "expo-secure-store";
import CarouselSlider from "../../components/HomepageComponents/CarouselSlider";
import NotificationCardView from "../../components/HomepageComponents/NotificationCardView";
import CardButton from "../../components/HomepageComponents/CardButton";
import Notification from "../../components/Notification/Notification";
import { useDispatch } from 'react-redux';
import { logout as performLogout } from '../../actions/authActions'; // Import your handleLogout from authActions
import { handleLogout } from "../../services/authServices";

const HomeScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();

  // Function to get user data from SecureStore
  const getUserData = async () => {
    const userDataString = await SecureStore.getItemAsync("DrishteeuserData");
    const data = JSON.parse(userDataString);
    setUserData(data);
  };

  useEffect(() => {
    getUserData();
  }, []);

  // Function to show a logout confirmation dialog
  const showLogoutConfirmation = () => {
    return new Promise((resolve) => {
      Alert.alert(
        "Confirm Logout",
        "Are you sure you want to Logout?",
        [
          {
            text: "Cancel",
            onPress: () => resolve(false), // User cancels the logout
            style: "cancel",
          },
          {
            text: "Logout",
            onPress: () => resolve(true), // User confirms the logout
          },
        ],
        { cancelable: false }
      );
    });
  };

  // Function to handle logout
  const handleLogoutPress = async () => {
    const userConfirmed = await showLogoutConfirmation(); // Show confirmation dialog
    if (userConfirmed) {
      try {
        // Call the handleLogout function from authActions
        const result = handleLogout(); // This calls the logout function from authActions

        if (result.success) {
          // If logout was successful, navigate to the Login screen
          navigation.replace("Login");
        } else {
          // console.error(result.message || 'Logout failed');
        }
      } catch (error) {
        // console.error("Failed to logout:", error);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />

        {userData && (
          <>
            <ScrollView
              style={styles.contentContainer}
              nestedScrollEnabled={Platform.OS === 'android'}
              contentContainerStyle={{}}
              showsHorizontalScrollIndicator={false}
            >
              <View style={styles.header}>
                <View style={styles.headtextcontainer}>
                  <Text style={styles.greeting}>
                    Hi, {userData.first_name.charAt(0).toUpperCase() + userData.first_name.slice(1).toLowerCase()}
                  </Text>
                  <Text style={styles.subheader}>Find your workspaces below!</Text>
                </View>

                {/* Logout Button */}
                <TouchableOpacity onPress={handleLogoutPress} style={styles.logoutcontainer}>
                  <Image
                    source={require("../../assets/logout.png")}
                    style={styles.logoutIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.content}>
                <View style={styles.workspaceSection}>
                  <View style={styles.cardContainer}>
                    <CardButton
                      imageSource={require("../../assets/HomeScreen/attendance.png")}
                      text="Attendance"
                      backgroundColor="#043e7d"
                      onPress={() => navigation.navigate("Attendance")}
                      subtext="Track your presence effortlessly"
                    />
                    <CardButton
                      imageSource={require("../../assets/HomeScreen/Expense.png")}
                      text="Expense"
                      backgroundColor="#0e353f"
                      onPress={() => navigation.navigate("Expense")}
                      subtext="Manage and submit expenses on the go"
                    />
                    <CardButton
                      imageSource={require("../../assets/HomeScreen/Csp.png")}
                      text="CSP"
                      backgroundColor="#046ec4"
                      subtext="Visit Central Service Point Monthly"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.messagesSection}>
                <Text style={styles.subTitle}>MESSAGES</Text>
                <Notification />
              </View>
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
