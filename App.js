// App.js
import React, { useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import FontLoader from './src/components/FontLoader';
import SplashScreen from './src/screens/SplashScreen/SplashScreen';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera'; // Correct import
import * as MediaLibrary from 'expo-media-library';
import AppNavigator from './appNavigator';

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Login'); // Default is login

  const requestPermissions = async () => {
    try {
      // Request Camera Permission
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync(); // Correct method
      if (cameraStatus !== 'granted') {
        alert('Camera permission is required.');
      }

      // Request Foreground Location Permission
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync(); // Updated method
      if (locationStatus !== 'granted') {
        alert('Location permission is required.');
      }

      // Request Media Library Permission (for file storage)
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      if (mediaStatus !== 'granted') {
        alert('Storage permission is required.');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const prepareApp = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate loading time
      await requestPermissions(); // Request necessary permissions

      // Check if user data is present
      const userData = await SecureStore.getItemAsync('DrishteeuserData');
      if (userData) {
        setInitialRoute('Tab'); // If logged in, go to main tab
      } else {
        setInitialRoute('Login'); // Else go to login
      }
    } catch (error) {
      console.error('Failed to load resources or user data:', error);
    } finally {
      setIsAppReady(true);
    }
  };

  useEffect(() => {
    prepareApp();
  }, []);

  if (!isAppReady) {
    return (
      <FontLoader>
        <SplashScreen onLoaded={() => setIsAppReady(true)} />
      </FontLoader>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <FontLoader>
          <AppNavigator initialRoute={initialRoute} />
        </FontLoader>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
