import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import theme from '../../utils/theme';

const SplashScreen = ({ onLoaded }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoaded();
    }, 3000); 

    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundFive,
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    color: theme.fonts.fontTwo,
    fontFamily: 'AbhayaLibre-Bold', 
  },
});

export default SplashScreen;
