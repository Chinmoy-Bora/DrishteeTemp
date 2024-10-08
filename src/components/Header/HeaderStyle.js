import { StyleSheet,Platform } from 'react-native';

const styles = StyleSheet.create({

    header:
    {
        width:'100%',
        height:'12%',
        backgroundColor:'#FFFDFD',
        borderWidth:1,
        borderColor:'#B6C6D1',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    firstContainer:
    {
        width:'1%',
        flex:1,
        height:'100%',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
        
    

    },
    backButton:
    {
        marginLeft:'20%',
        marginTop:'12%'
        
    },
    backarrow:
    {
        height:24,
        width:34,
        marginLeft:70,
        marginTop:'1%',
    },
    title:
    {
        fontFamily:'AbhayaLibre-Regular',
        fontSize:26,
        height:'100%',
       alignSelf:'center',
       alignContent:'center',
       marginTop:'7%',  
    },
    lastContainer:
    {
        width:'99%',
        height:'100%',
        display:'flex',
        justifyContent:'flex-start',
        alignItems:'center',
    }
});

export default styles;