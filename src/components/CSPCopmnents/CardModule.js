import React from 'react';
import { StyleSheet,View,Text } from 'react-native'
import theme from '../../utils/theme';
import { TouchableOpacity } from 'react-native-gesture-handler';

const CardModule = ({name,backgroundColor})=> {
  return (
    
    <View style={[styles.module,
        backgroundColor
    ]}>

            <Text style={styles.text}>{name}</Text>

    </View>
 


  )
};

const styles=StyleSheet.create(
    {
        module:
        {
            width:'90%',
            height:'100%',
            borderRadius:10,
            backgroundColor:'blue',
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            color:theme.fonts.fontOne,
            fontFamily:"AbhayaLibre-Regular",
            fontSize:20,
            
           
          
        },
        text:
        {
            color:theme.fonts.fontOne,
            fontFamily:"AbhayaLibre-Regular",
            fontSize:20,
            
        }
    }
);

export default CardModule;