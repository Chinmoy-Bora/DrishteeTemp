import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../../utils/theme';

const ClarificationCard = ({ name, title, date, time, description }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Date: {date}</Text>
        <Text style={styles.label}>Time: {time}</Text>
      </View>
      <Text style={styles.label}>Title: {title}</Text>
      <Text style={styles.label}>Description:</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    borderColor: theme.colors.secondary,
    borderWidth:1,
    padding: 15,
    margin: 10,
    shadowColor: theme.colors.tertiary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // For Android shadow support
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: theme.fonts.fontTwo,
  },
  description: {
    fontSize: 14,
    color: theme.fonts.fontTwo,
    marginTop: 5,
  },
});

export default ClarificationCard;
