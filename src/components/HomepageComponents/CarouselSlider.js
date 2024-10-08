import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';

const CarouselSlider = () => {
  return (
    <ImageBackground
      source={require("../../assets/Carousel/pic1.png")} // Background image
      style={styles.card}
      imageStyle={{ borderRadius: 10 }} // Ensures the image conforms to the card's rounded corners
    />
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 150,
    backgroundColor: '#036BB9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    
    marginTop:5,
    
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default CarouselSlider;
