import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import theme from '../utils/theme';

const CustomButton1 = ({ onPress, title, loading }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}  disabled={loading}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 40,
    backgroundColor: theme.colors.ButtonPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop:10,
    marginBottom: 20,
  },
  buttonText: {
    color: theme.fonts.fontOne,
    fontSize: 16,
    fontFamily: 'AbhayaLibre-Regular',
  },
});

export default CustomButton1;
