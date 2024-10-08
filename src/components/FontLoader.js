import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';


const FontLoader = ({ children }) => {
  
  const [fontsLoaded] = useFonts({
    'AbhayaLibre-Regular': require('../../assets/fonts/AbhayaLibre-Regular.ttf'),
    'AbhayaLibre-Bold': require('../../assets/fonts/AbhayaLibre-Bold.ttf'),
    'Aclonica-Regular':require('../../assets/fonts/Aclonica-Regular.ttf')
  });

  if(!fontsLoaded){
    console.log("Fonts Didn't get loaded");
    return;
  }

  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FontLoader;
