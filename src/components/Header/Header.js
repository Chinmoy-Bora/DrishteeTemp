import React, { useEffect, useState } from "react";
import { View, Image, Text } from "react-native";
import * as SecureStore from "expo-secure-store";
import { TouchableOpacity } from "react-native-gesture-handler";
import styles from "./HeaderStyle"







const Header = ({ title,onPress, showBackArrow }) => {
    return (
        <View style={styles.header}>
            <View style={styles.firstContainer} >

            {showBackArrow && (
                <TouchableOpacity onPress={onPress} style={styles.backButton}>
                    <Image
                        source={require('../../assets/ProfileScreen/Backarrow.png')}
                        style={styles.backarrow}
                    />
                </TouchableOpacity>
                
            )}
            </View>
            <View style={styles.lastContainer} >

            <Text style={styles.title}>{title}</Text>
            </View>
            
        </View>
    );
};

export default Header;
