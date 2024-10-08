import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '../../utils/theme';

const CardButton = ({ imageSource, text, backgroundColor, onPress ,subtext}) => {
  return (
    <TouchableOpacity onPress={onPress}  style={[styles.card, { backgroundColor }]} >
    
        
      <Image source={imageSource} style={styles.image} />
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.subtext}>{subtext}</Text>

    </TouchableOpacity>
    
  );
};

const styles = StyleSheet.create({
  card: {
    width:'48%',
    height: 150,
    padding:20,
    borderRadius: 10,
    shadowColor: theme.colors.tertiary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    justifyContent: 'space-between',
    alignItems: 'left',
    marginVertical: 10,
  },
  image: {
    width: 30,
    height: 30,
    tintColor: theme.colors.primary,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: theme.fonts.fontOne,
    textAlign: 'left',
    fontFamily:'AbhayaLibre-Regular'
  },
  subtext: {
    fontSize: 10,
    color: theme.fonts.fontOne,
    lineHeight: 15,
    fontWeight:"200",
    textAlign: 'left',
  },
});

export default CardButton;
