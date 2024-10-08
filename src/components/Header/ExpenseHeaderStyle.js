import { StyleSheet,Platform } from 'react-native';
import theme from '../../utils/theme';

const styles = StyleSheet.create({

    header:
    {
        width:'100%',
        height: Platform.OS === 'android'? 70 : 40,
        backgroundColor: theme.colors.secondary,
        borderColor:'#B6C6D1',
        display:'flex',
        flexDirection:'row',
        alignItems:'left',
        justifyContent:'flex-start',
        alignItems:'center',
        paddingBottom:Platform.OS==='ios'? 20:0,
        
    },
    
    
    backarrow:
    {
        height:15,
        width:15,
        padding: 10,
        marginLeft:20,
        tintColor : theme.colors.colorOne

    },
    title:
    {
        fontSize:16,
        fontWeight: "600",
        marginLeft :20,
        
        color : theme.fonts.fontOne
    },
   
  
});

export default styles;