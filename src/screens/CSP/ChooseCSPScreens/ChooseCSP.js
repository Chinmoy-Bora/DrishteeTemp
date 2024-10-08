import React, { useEffect, useState } from "react";
import { View, Text, FlatList, SafeAreaView } from "react-native";
import * as SecureStore from "expo-secure-store";
import { TouchableOpacity } from "react-native-gesture-handler";
import ExpenseHeader from "../../../components/Header/ExpenseHeader";
import styles from "./ChooseCSPStyle";
import axios from 'axios';
import { BASE_URL, CSP_USER_LIST_ENDPOINT } from '@env';
import theme from "../../../utils/theme";

// const DATA = [
//     {
//         'id': '1',
//         'CSPcode': 1,
//         'CSPname': 'a',
//         'status': 'b'
//     },
//     {
//         'id': '2',
//         'CSPcode': 2,
//         'CSPname': 'a',
//         'status': 'b'
//     },
//     {
//         'id': '3',
//         'CSPcode': 3,
//         'CSPname': 'a',
//         'status': 'b'
//     },
//     {
//         'id': '4',
//         'CSPcode': 4,
//         'CSPname': 'a',
//         'status': 'b'
//     },
//     {
//         'id': '5',
//         'CSPcode': 4,
//         'CSPname': 'a',
//         'status': 'b'
//     },
//     {
//         'id': '6',
//         'CSPcode': 4,
//         'CSPname': 'a',
//         'status': 'b'
//     },
//     {
//         'id': '7',
//         'CSPcode': 4,
//         'CSPname': 'a',
//         'status': 'b'
//     },
//     {
//         'id': '8',
//         'CSPcode': 4,
//         'CSPname': 'a',
//         'status': 'b'
//     },
// ];

const Item = ({ CSPname, CSPcode, cspstatus, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.item}>


            <Text style={styles.title}><Text style={styles.part1}>CSP Code : </Text>{CSPcode}</Text>

            <Text style={styles.title}><Text style={styles.part1}>CSP Name : </Text> {CSPname}</Text>

            <Text style={styles.title}><Text style={styles.part1}>Status : </Text>{cspstatus}</Text>


        </TouchableOpacity>
    );
}

const ChooseCSP = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getUserData = async () => {
        try {
            const userDataString = await SecureStore.getItemAsync("userData");
            const data = JSON.parse(userDataString);
            setUserData(data);
        } catch (error) {
            setError("Failed to retrieve user data.");
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    useEffect(() => {
        if (userData) {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`${BASE_URL}${CSP_USER_LIST_ENDPOINT}?userid=${userData.modified_by}`);
                    if (response.data && response.data.Data2) {

                        const formattedData = response.data.Data2.map((item, index) => ({
                            id: index.toString(),
                            CSPcode: item.cspcode,
                            CSPname: item.cspname,
                            cspstatus: item.cspstatus
                        }));
                        setData(formattedData);
                        console.log(formattedData);
                    } else {
                        throw new Error("Data2 not found in response");
                    }
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [userData]);

    function OnPress() {
    navigation.goBack();
    }

    function handlePress(item) {
        navigation.navigate('CSPForm',{item})
    }

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    return (
        <>
        <SafeAreaView style={{flex:1,backgroundColor:theme.colors.headerColor}}>

        
        <ExpenseHeader
          title="Choose CSP"
          onPress={() => navigation.goBack()}
          showBackArrow={true}
        />
            <FlatList
                data={data}
                renderItem={({ item }) => (
                    <Item
                        CSPname={item.CSPname}
                        CSPcode={item.CSPcode}
                        cspstatus={item.cspstatus}
                        onPress={() => handlePress(item)}
                    />
                )}
                keyExtractor={item => item.id}
            />
            </SafeAreaView>
        </>
        
    );
};

export default ChooseCSP;
