import React from 'react'
import { SafeAreaView, View, Text, Image } from 'react-native';
import styles from './FormStyle';
import CardModule from '../../components/CSPCopmnents/CardModule';
import theme from '../../utils/theme';
import ExpenseHeader from '../../components/Header/ExpenseHeader';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function FormScreen({ navigation, route }) {
    function handleFormA() {
        console.log('Form A');
    }

    const { item } = route.params;
    console.log(item);
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.headerColor }}>
            <ExpenseHeader
                title="CSP Forms"
                onPress={() => navigation.goBack()}
                showBackArrow={true}
            />


            <View style={styles.mainContainer}>

                <View style={{ width: '90%', height: '10%', backgroundColor: 'blue', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '10%' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: theme.fonts.fontOne }}>CSP Code : </Text>
                        <Text style={{ color: theme.fonts.fontOne }}>{item.CSPcode}</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <Text style={{ color: theme.fonts.fontOne }}>CSP Name : </Text>
                        <Text style={{ color: theme.fonts.fontOne }}>{item.CSPname}</Text>
                    </View>
                </View>

                <View style={{ width: '100%', height: '10%' }}>

                    <TouchableOpacity style={{ width: '100%', height: '100%' }} >
                        <View style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'blue', alignItems: 'center', paddingHorizontal: '2%' }}>

                            <Image
                                source={require("../../assets/CSP/circle-a.png")}
                                style={{ width: 30, height: 30 }}
                            />
                            <Text style={{ color: theme.fonts.fontOne, paddingRight: '50%' }}>Form A</Text>

                            <Image
                                source={require("../../assets/CSP/angle-small-right.png")}
                                style={{ width: 30, height: 30 }}
                            />

                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ width: '100%', height: '10%' }}>

                    <TouchableOpacity style={{ width: '100%', height: '100%' }} >
                        <View style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'blue', alignItems: 'center', paddingHorizontal: '2%' }}>

                            <Image
                                source={require("../../assets/CSP/circle-b.png")}
                                style={{ width: 30, height: 30 }}
                            />
                            <Text style={{ color: theme.fonts.fontOne, paddingRight: '50%' }}>Form A</Text>

                            <Image
                                source={require("../../assets/CSP/angle-small-right.png")}
                                style={{ width: 30, height: 30 }}
                            />

                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ width: '100%', height: '10%' }}>

                    <TouchableOpacity style={{ width: '100%', height: '100%' }} >
                        <View style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'blue', alignItems: 'center', paddingHorizontal: '2%' }}>

                            <Image
                                source={require("../../assets/CSP/circle-c.png")}
                                style={{ width: 30, height: 30 }}
                            />
                            <Text style={{ color: theme.fonts.fontOne, paddingRight: '50%' }}>Form A</Text>

                            <Image
                                source={require("../../assets/CSP/angle-small-right.png")}
                                style={{ width: 30, height: 30 }}
                            />

                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ width: '100%', height: '10%' }}>

                    <TouchableOpacity style={{ width: '100%', height: '100%' }} >
                        <View style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'blue', alignItems: 'center', paddingHorizontal: '2%' }}>

                            <Image
                                source={require("../../assets/CSP/circle-d.png")}
                                style={{ width: 30, height: 30 }}
                            />
                            <Text style={{ color: theme.fonts.fontOne, paddingRight: '50%' }}>Form A</Text>

                            <Image
                                source={require("../../assets/CSP/angle-small-right.png")}
                                style={{ width: 30, height: 30 }}
                            />

                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ width: '100%', height: '10%' }}>

                    <TouchableOpacity style={{ width: '100%', height: '100%' }} >
                        <View style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'blue', alignItems: 'center', paddingHorizontal: '2%' }}>

                            <Image
                                source={require("../../assets/CSP/circle-e.png")}
                                style={{ width: 30, height: 30 }}
                            />
                            <Text style={{ color: theme.fonts.fontOne, paddingRight: '50%' }}>Form A</Text>

                            <Image
                                source={require("../../assets/CSP/angle-small-right.png")}
                                style={{ width: 30, height: 30 }}
                            />

                        </View>
                    </TouchableOpacity>
                </View>


            </View>
        </SafeAreaView>
    )
}
