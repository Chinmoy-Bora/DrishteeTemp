import React from 'react';
import { View, StyleSheet, Platform, ScrollView } from 'react-native';
import theme from '../utils/theme';

const CardView = ({ children }) => {
  return (
    <View style={styles.container}>
      {/* <ScrollView contentContainerStyle={styles.card}> */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>

        {children}
</View>
       </ScrollView> 
    </View>
  );
};

const styles = StyleSheet.create({

  card: {
    width: '88%',
marginBottom : "10%",
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    padding: 30,
      ...Platform.select({
      ios: {
        shadowColor: theme.colors.tertiary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.6,
        shadowRadius: 9,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  container: {
    flex: 1,  // Ensures the container takes the full height of the screen
    justifyContent: 'center',  // Centers content vertically within the container
    alignItems: 'center',      // Centers content horizontally within the container
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",  // Center content vertically within the scroll view
    alignItems: 'center',      // Center content horizontally within the scroll view
    paddingVertical: 20,       // Add vertical padding
  },
});



export default CardView;
