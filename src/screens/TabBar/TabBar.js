import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Platform, SafeAreaView } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Home/HomeScreen';
import ProfileScreen from '../ProfileScreen/Profile';
import ExpenseBaseScreen from '../Expense/ExpenseBaseScreen';
import AttendanceScreen from '../Attendance/AttendanceScreen';

const Tab = createBottomTabNavigator();

// Custom tab button component
const CustomTabButton = ({ children, onPress , focused }) => {
    return (
    
        <TouchableOpacity
            onPress={onPress}
            style={{
                top: -30,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <View
                style={{
                    width: 70,
                    height: 70,
                    borderRadius: 40,
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: focused ? '#036BB9' : '#000', 
                    ...styles.shadow,

                }}>
                
                    {children}
            </View>
        </TouchableOpacity>

    );
};

const TabBar = () => {
    return (
        <Tab.Navigator
        initialRouteName="Home"
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    borderTopRightRadius :25,
                    borderTopLeftRadius :25,
                    backgroundColor: '#FFFDFD',
                    height: '8%',
                },
            }}
        >
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ justifyContent: 'center', alignItems: 'center'  ,
                                paddingTop:Platform.OS==='ios' ? '9%' : 0 ,}}>
                                <Image
                                    source={focused 
                                    ?   require('../../assets/TabNavigation/profileiconfilled.png')
                                    :   require('../../assets/TabNavigation/profileicon.png')
                                        }
                                    resizeMode="contain"
                                    style={{
                                        width: 25,
                                        height: 25,
                                        tintColor: focused ? '#036BB9' : '#B6C6D1',
                                       
                                      
                                    }}
                                />
                            </View>
                        );
                    },
                }}
            />
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Image
                            source={focused 
                                ?   require('../../assets/TabNavigation/homeiconfilled.png')
                                :   require('../../assets/TabNavigation/homeicon.png')
                                    }
                                resizeMode="contain"
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: focused ? '#036BB9' : '#B6C6D1',
                                    
                                }}
                            />
                        );
                    },
                    tabBarButton: (props) => <CustomTabButton {...props} focused={props.accessibilityState.selected} />,
                }}
            />
            <Tab.Screen
                name="Expense"
                component={ExpenseBaseScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ justifyContent: 'center', alignItems: 'center',
                                paddingTop:Platform.OS==='ios' ? '9%' : 0 ,
                             }}>
                                <Image
                                     source={focused 
                                        ?   require('../../assets/TabNavigation/chaticonfilled.png')
                                        :   require('../../assets/TabNavigation/chaticon.png')
                                            }
                                    resizeMode="contain"
                                    style={{
                                        width: 25,
                                        height: 25,
                                        tintColor: focused ? '#036BB9' : '#B6C6D1',
                                    }}
                                />
                            </View>
                        );
                    },
                }}
                
            />
               <Tab.Screen
                name="Attendance"
                component={AttendanceScreen}
                options={{
                    tabBarButton: () => null, // Hide the tab button
                    tabBarIcon: () => null, // Do not show an icon
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create(
    {
        shadow: {
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 9,
        }
    }
)

export default TabBar;
