import React, { useEffect, useState } from "react";
import { View, Image, Text, Alert } from "react-native";
import styles from "./ProfileStyle";
import * as SecureStore from "expo-secure-store";
import { TouchableOpacity } from "react-native-gesture-handler";
import CustomButton1 from "../../components/CustomButton1";
import { handleLogout } from "../../services/authServices";


const ProfileScreen = ({ navigation }) => {
    const [userData, setUserData] = useState(null);

    const getUserData = async () => {
        const userDataString = await SecureStore.getItemAsync("DrishteeuserData");
        const data = JSON.parse(userDataString);
        setUserData(data);
    };

    useEffect(() => {
        getUserData();
    }, []);

 

    const showLogoutConfirmation = () => {
        return new Promise((resolve) => {
            Alert.alert(
                "Confirm Logout",
                "Are you sure you want to Logout?",
                [
                    {
                        text: "Cancel",
                        onPress: () => resolve(false), // User chose to cancel
                        style: "cancel"
                    },
                    {
                        text: "Logout",
                        onPress: () => resolve(true), 
                    }
                ],
                { cancelable: false } 
            );
        });
      };
    
      const handleLogoutPress = async () => {
        const userConfirmed = await showLogoutConfirmation();
        if(userConfirmed){
            try
            {
                const result = handleLogout();
                if(result.success)
                {
                    navigation.replace("Login");
                }
            }
            catch
            {
                console.error(error||"Failed");
            }
         
        }
    };
    
    
    return (
        <View style={styles.container}>

            {userData && (
                <View style={styles.midContainer} >

                    <View style={styles.circle}>
                    <Image source={require("../../assets/HomeScreen/logoicon.png")} style={styles.circle1}/> 

                        {/* <Image source={require('../../assets/ProfileScreen/profile.png')} style={styles.circle1} /> */}
                    </View>
                    <View style={styles.cardContainer}>
                        {userData.first_name &&( <Text style={styles.textname}>{userData.first_name} {userData.last_name}</Text>)}
                        {userData.mis_employee_code &&( <View style={styles.textarea}>
                            <Text style={styles.text}>{userData.mis_employee_code}</Text>
                        </View>)}
                        {userData.org &&( 
                        <View style={styles.textarea}>
                            <Text style={styles.text}>{userData.org}</Text>
                        </View>)}
                         {userData.user_email &&( 
                        <View style={styles.textarea}>
                            <Text style={styles.text}>{userData.user_email}</Text>
                        </View>)}
                        {userData.mobile_no &&( 
                        <View style={styles.textarea}>
                            <Text style={styles.text}>{userData.mobile_no}</Text>
                        </View>)}
                         {userData.rhq_name &&( 
                        <View style={styles.textarea}>
                            <Text style={styles.text}>{userData.rhq_name}</Text>
                        </View>)}
                        <CustomButton1 title="Logout" onPress={handleLogoutPress}/>
                    </View>
                </View>
            )}
           
        </View>
    );
};

export default ProfileScreen;
