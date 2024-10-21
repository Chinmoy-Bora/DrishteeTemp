import React, { useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import FontLoader from './src/components/FontLoader';
import SplashScreen from './src/screens/SplashScreen/SplashScreen';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera'; 
import * as MediaLibrary from 'expo-media-library';
import AppNavigator from './appNavigator';
import { store, persistor } from './src/store/store'; 

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Login'); 

  const requestPermissions = async () => {
    try {
      const permissions = await Promise.all([
        Camera.requestCameraPermissionsAsync(),
        Location.requestForegroundPermissionsAsync(),
        MediaLibrary.requestPermissionsAsync(),
      ]);

      const cameraStatus = permissions[0].status;
      const locationStatus = permissions[1].status;
      const mediaStatus = permissions[2].status;

      if (cameraStatus !== 'granted') {
        alert('Camera permission is required.');
      }
      if (locationStatus !== 'granted') {
        alert('Location permission is required.');
      }
      if (mediaStatus !== 'granted') {
        alert('Storage permission is required.');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const prepareApp = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 3000)); 
      await requestPermissions(); 

    
      const userData = await SecureStore.getItemAsync('DrishteeuserData');
      if (userData) {
        setInitialRoute('Tab'); 
      } else {
        setInitialRoute('Login'); 
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
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            <FontLoader>
              <AppNavigator initialRoute={initialRoute} />
            </FontLoader>
          </NavigationContainer>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
