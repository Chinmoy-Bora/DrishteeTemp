import React, { useEffect, useState } from "react";
import { View, Image, Text, SafeAreaView } from "react-native";
import * as SecureStore from "expo-secure-store";
import { TouchableOpacity } from "react-native-gesture-handler";
import styles from "../CSP/CSPScreenStyle";
import Header from "../../components/Header/Header";
import ExpenseHeader from "../../components/Header/ExpenseHeader";
import theme from "../../utils/theme";
import CardModule from "../../components/CSPCopmnents/CardModule";

const CSPScreen = ({ navigation }) => {
  const handlePress=()=>
  {
    navigation.navigate('ChooseCSP');
  }
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.headerColor }}>
        <ExpenseHeader
          title="CSP"
          onPress={() => navigation.goBack()}
          showBackArrow={true}
        />
        <View style={styles.maincontainer}>
      <View style={{width:'100%',height:'10%',paddingLeft:'8%'}}>
      <TouchableOpacity style={{width:'100%',height:'100%'}} onPress={handlePress}>
      <CardModule
              name="CSP visit form"
              backgroundColor='#046ec4'
               />

          </TouchableOpacity>

      </View>




        </View>

        <View style={styles.emptyStateContainer}>


          <Text style={styles.noDataText}>Coming Soon</Text>
        </View>
      </SafeAreaView>
    </>
  );
};

export default CSPScreen;
