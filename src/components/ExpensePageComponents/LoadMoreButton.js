import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import theme from '../../utils/theme';

const LoadMoreButton = ({ onPress }) => {
  return (
    <View style={styles.loadMoreContainer}>
      <TouchableOpacity style={styles.loadMoreButton} onPress={onPress}>
        <Text style={styles.loadMoreText}>Load More</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  loadMoreContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  loadMoreButton: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    width: 120,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
  },
  loadMoreText: {
    color: theme.fonts.fontThree,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default LoadMoreButton;
