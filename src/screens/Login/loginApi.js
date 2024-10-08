import axios from 'axios';
import { BASE_URL, LOGIN_API, SYSTEMLOGIN_URL, GETDESIGNATION_URL, TOKEN, FCMID } from '@env';
import { checkNetworkConnectivity } from '../../utils/network';
import * as SecureStore from 'expo-secure-store';

// Function to perform login
const performLogin = async (email, password) => {
  const isConnected = await checkNetworkConnectivity();
  if (!isConnected) {
    throw new Error('No network connection');
  }

  const loginResponse = await axios.post(
    `${BASE_URL}${LOGIN_API}`,
    { username: email, password, TOKEN, FCMID },
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  if (loginResponse.status !== 200) {

    throw new Error(loginResponse.data.message || 'Login request failed');
  }

  return loginResponse.data.Data[0];

};

// Function to fetch designation
const fetchDesignation = async (userCode) => {
  const response = await axios.get(
    `${BASE_URL}${GETDESIGNATION_URL}${userCode}`,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );


  if (response.status !== 200) {
    throw new Error(response.data.message || 'Designation fetch failed');
  }else if(response.data.Message=="No records found"){

    throw new Error(response.data.Message);
  }
  

  return response.data.Data[0];
};

// Function to perform system login
const performSystemLogin = async (email, password) => {
  const response = await axios.post(
    SYSTEMLOGIN_URL,
    { username: email, password },
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  if (response.status !== 200) {
    throw new Error('System login request failed');
  }

  return response.data;
};

// Main function to handle login
export const handleLogin = async (email, password, TOKEN, FCMID) => {
  try {
    const loginData = await performLogin(email, password, TOKEN, FCMID);

    if (loginData.user_code === 0) {
      throw new Error('Invalid username or password');
    }

    const designationData = await fetchDesignation(loginData.user_code);

    const systemLoginData = await performSystemLogin(email, password);

    const mergedData = { ...loginData, ...designationData, token: systemLoginData };

    await SecureStore.setItemAsync("DrishteeuserData", JSON.stringify(mergedData));
    
    const userData = await SecureStore.getItemAsync('DrishteeuserData');
    if(userData!==null){
    return { success: true, data: mergedData };
  }else{
    throw new Error('Data could not be gathered properly');

  }
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message || 'An error occurred' };
  }
};
