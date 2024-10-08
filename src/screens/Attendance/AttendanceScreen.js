import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import * as Location from 'expo-location';
import { ATTENDANCEKEY_URL, ATTENDANCE_WEBVIEW_URL } from '@env';


const AttendanceScreen = ({ navigation }) => {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(true);


  const requestPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to access this feature.');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log('Location:', location);
  };

  const fetchData = async () => {
    try {
      const userData = await SecureStore.getItemAsync('DrishteeuserData');
      const { org, mis_employee_code } = JSON.parse(userData);

      if (!mis_employee_code) {
        Alert.alert('Error', 'Employee code is missing.');
        navigation.goBack();
        return;
      }

      let tokenUrl = `${ATTENDANCEKEY_URL}${mis_employee_code}`;
      let bearerToken = '';

      // Determine the correct bearer token based on org
      if (org === 'DDCL') {
        bearerToken = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJERENMIiwidW5pcXVlX25hbWUiOiJERENMIiwibmJmIjoxNjgwNjk3NDEzLCJleHAiOjE5OTYzMTY2MTMsImlhdCI6MTY4MDY5NzQxM30.0WlP8TwO1HMtfployy3KJm1ipy0y6Ct1Oc0gphlq68oyvTNwI-VcHEMH3bcdiK4vRbR7tsFLF9u-T52L5vODGg';
      } else if (org === 'DF') {
        bearerToken = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJEUkYiLCJ1bmlxdWVfbmFtZSI6IkRSRiIsIm5iZiI6MTY4MDY5NzM5NCwiZXhwIjoxOTk2MzE2NTk0LCJpYXQiOjE2ODA2OTczOTR9.uEXfYq6azck_HMSTXQDX5ksREMVynZRKAxAKkEo3YV1Thn44n6beePiHRQPyAMYGEWbYPS4ksWbXLrtqL_IYVA';
      } else if (org === 'DSDC') {
        bearerToken = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJEU0RDIiwidW5pcXVlX25hbWUiOiJEU0RDIiwibmJmIjoxNjgwNjk3Mzc4LCJleHAiOjE5OTYzMTY1NzgsImlhdCI6MTY4MDY5NzM3OH0.xDZp53zXNkPFsrGZilQSoLg9d36StDng6hQezmKRHkFLEHsCh35_fzNfAmcml4L4ybGr1lqViUe5cabxnculjg';
      } else {
        Alert.alert('Error', 'Invalid organization.');
        navigation.goBack();
        return;
      }

      // Fetch the token
      console.log("Fetching token from:", tokenUrl);
      const response = await axios.get(tokenUrl, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });

      if (response.status === 200) {
        const resToken = response.data.data.Token;
        console.log("Token received:", resToken);
        setUrl(`${ATTENDANCE_WEBVIEW_URL}${resToken}`);
      } else {
        Alert.alert('Error', 'Failed to fetch token.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    requestPermissions();
    fetchData();
  }, []);


  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : url ? (
        <WebView source={{ uri: url }} style={styles.webview} />
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load content.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:20,
    marginBottom:50,
    backgroundColor:'#FFF',
  },
  webview: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default AttendanceScreen;
