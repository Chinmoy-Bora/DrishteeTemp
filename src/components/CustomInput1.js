import React from 'react';
import { TextInput, View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../utils/theme';

const CustomInput1 = ({ placeholder, secureTextEntry, value, onChangeText, isPassword, togglePasswordVisibility }) => {
  return (
    <View style={isPassword ? styles.passwordContainer : null}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
      />
      {isPassword && (
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Icon name={secureTextEntry ? 'visibility' : 'visibility-off'} size={24} color="#aaa" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 40,
    borderColor: theme.colors.borderOne,
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: theme.fonts.fontTwo,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  eyeIcon: {
    position: 'relative',
    right: 32,
    bottom: 10,
  },
});

export default CustomInput1;
