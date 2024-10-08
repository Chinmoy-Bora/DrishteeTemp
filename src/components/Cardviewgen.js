import React from 'react';
import { View, StyleSheet, Platform, ScrollView,Text } from 'react-native';
import theme from '../utils/theme';

const CardViewgen = ({ children }) => {
  return (
    
    <View style={styles.cardContainer}>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    width: '90%',
    height: '50%',
    backgroundColor: '#F8F8F8',
    borderRadius: 30,
    // marginTop: '80%',
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.tertiary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 9,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  card: {
    alignItems: 'center',
    padding: 30,
  },
});

export default CardViewgen;