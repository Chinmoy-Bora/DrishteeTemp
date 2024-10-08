import React from "react";
import { View, Text, Image,Platform, StyleSheet, TouchableOpacity } from "react-native";

const RectangleButton = ({ imageSource, text, backgroundColor,onPress, tintColor,color }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor }]}>
        <Image source={imageSource} style={[styles.image,{tintColor}]} />
        <Text style={[styles.text, {color}  ]}>{text}</Text>

      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width:"50%",
    alignItems: "center",
    overflow:"hidden",
    paddingBottom :10,
    paddingTop: 10,
  },
  button: {
    padding:20,
    width: 120,
    height: 120,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#5791b3',      // Blue shadow color
        shadowOffset: { width: 0, height: 3 }, // Offset for shadow
        shadowOpacity: 0.6,          // Opacity of the shadow
        shadowRadius: 6,             // Blur radius of the shadow
      },
      android: {
        elevation: 10 ,               // Android shadow (elevation)
        // shadowColor: '#5791b3',      // Blue shadow color (custom property, may vary across devices)
      },
    }),
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    // elevation:10,

  },
  image: {
    width: 30,
    height: 30,
  
  },
  text: {
    fontSize: 10,
    fontWeight:"bold",
    width: '100%',  
    flexShrink: 1, 
    textAlign: "center",
    width:"100%"
  },
});

export default RectangleButton;
