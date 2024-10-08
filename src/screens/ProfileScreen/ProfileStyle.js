import { StyleSheet, Platform } from 'react-native';
import theme from '../../utils/theme';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.backgroundFive,
    },


    midContainer: {

        backgroundColor: '#242D54',
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16, 
    },

    circle: {
        width: 50, 
        height: 50,
        backgroundColor: theme.colors.primary,
        borderRadius: 100,
        borderWidth: 0.5,
        borderColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },

    circle1: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },

   

    cardContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20, 
       
    },


    textname: {
        fontSize: 16, 
        color: theme.fonts.fontOne,
        marginBottom: 20, 
        textAlign: 'left',
        fontFamily: 'AbhayaLibre-Bold',
    },
    text: {
        fontSize: 12, 
        color: theme.fonts.fontOne,
        textAlign: 'center',
        fontWeight:"500"
    },

    textarea: {
        width:"100%",
overflow:"hidden",
        verticalAlign:"middle",
        justifyContent:"center",
        backgroundColor:"#505D78",
        borderRadius:10,
padding:10, 
        marginBottom: 15, 
    },

  
});

export default styles;
