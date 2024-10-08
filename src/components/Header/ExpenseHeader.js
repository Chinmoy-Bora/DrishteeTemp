import React, { useEffect, useState } from "react";
import { View, Image, Text } from "react-native";
import * as SecureStore from "expo-secure-store";
import { TouchableOpacity } from "react-native-gesture-handler";
import styles from "./ExpenseHeaderStyle"







const ExpenseHeader = ({ title,onPress, showBackArrow }) => {
    return (
        <View style={styles.header}>

            {showBackArrow && (
                <TouchableOpacity onPress={onPress} style={styles.backButton}>
                    <Image
                        source={require('../../assets/Expense/backarrow.png')}
                        style={styles.backarrow}
                    />
                </TouchableOpacity>
                
            )}

            <Text style={styles.title}>{title}</Text>
            
        </View>
    );
};

export default ExpenseHeader;
