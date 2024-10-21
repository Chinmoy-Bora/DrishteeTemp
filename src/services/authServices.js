import axios from 'axios';
import { BASE_URL, LOGIN_API, SYSTEMLOGIN_URL, GETDESIGNATION_URL, TOKEN, FCMID } from '@env';
import { checkNetworkConnectivity } from '../utils/network';
import * as SecureStore from 'expo-secure-store';
import { store } from '../store/store';
import { loginSuccess, logout } from '../actions/authActions'; // Redux actions for login and logout

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
  } else if (response.data.Message === "No records found") {
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

// Main function to handle login, store in Redux, and persist the data
export const handleLogin = async (email, password, TOKEN, FCMID) => {
  try {
    const loginData = await performLogin(email, password, TOKEN, FCMID);

    if (loginData.user_code === 0) {
      throw new Error('Invalid username or password');
    }

    const designationData = await fetchDesignation(loginData.user_code);
    const systemLoginData = await performSystemLogin(email, password);

    const mergedData = { ...loginData, ...designationData, token: systemLoginData };

    // Store the mergedData securely in SecureStore
    await SecureStore.setItemAsync('DrishteeuserData', JSON.stringify(mergedData));

    // Dispatch login success action to Redux store
    store.dispatch(loginSuccess(mergedData));  // Dispatch login data to Redux

    // Return success
    return { success: true, data: mergedData };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message || 'An error occurred' };
  }
};

// Function to handle logout and clear the Redux store and SecureStore
export const handleLogout = async () => {
  try {
    // Clear the stored data from SecureStore
    await SecureStore.deleteItemAsync('DrishteeuserData');

    // Dispatch logout action to clear Redux store
    store.dispatch(logout());

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Logout failed' };
  }
};
