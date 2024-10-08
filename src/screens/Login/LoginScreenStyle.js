import { StyleSheet,Platform } from "react-native";
import theme from "../../utils/theme";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: 'center',
      position: 'relative',
      backgroundColor: theme.colors.backgroundFive,
    },
    backgroundImage: {
      width: '100%',
      height: '55%', 
      position: 'absolute',
      borderRadius: 20,
      top: 0,
    },
    logoContainer: {
      position: 'absolute',
      top: 25,
      left: 20,
    
      zIndex: 0,
    },
    logo: {
      width: 200,
      height: 100, 
      resizeMode: 'contain',
    },
    overlay: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    loginContainer: {
      width: '90%',
      height: '50%',
      padding: 30,
      backgroundColor: theme.colors.primary,
      borderRadius: 30,
      alignItems: 'center',
      position: 'relative',
      marginTop: '80%', 
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.tertiary,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.6,
          shadowRadius: 9,
        },
        android: {
          elevation: 5,
        },
      }),
    },
    title: {
      fontSize: 17  ,
      color: theme.fonts.fontTwo,
      marginBottom: 20,
      textAlign: 'center',
      fontFamily: 'AbhayaLibre-Bold'
    },
    highlight: {
      color: theme.colors.error,
      fontFamily:'Aclonica-Regular'

    },
    input: {
      width: '100%',
      height: 48,
      borderColor: theme.colors.borderOne,
      borderWidth: 0.5,
      borderRadius: 5,
      marginBottom: 16,
      paddingHorizontal: 16,
      fontSize: 16,
      color: theme.fonts.fontTwo,
    },
    warnText:
    {
      width:'100%',
      color:theme.colors.error,
        opacity: .6,
        marginTop:"-5%",
        marginBottom:20,
        fontSize:12
    },

    warnText2:
    {
      width:'100%',

        color:theme.colors.error,
        opacity: .6,
        marginTop:"-7%",
        marginBottom:20,
        fontSize:12
    },
    warnText3:
    {
        color:theme.colors.error,
        opacity: .6,
        width:'100%',

        marginTop:"-7%",
        marginBottom:20,
        fontSize:12
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom:10,
      },
      eyeIcon: {
        position: 'relative',
        right: 32,
        bottom : 10
      },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
      },
      checkbox: {
        
        marginRight: 10,
      },
      checkboxtextcontain:{

        flex:1,
        flexDirection: 'row',
        flexWrap: 'wrap', 
      },
      checkboxLabel: {
        fontSize: 16,
        fontFamily:'AbhayaLibre-Regular',
      },
      checkboxLabel1: {
        fontSize: 16,
        color:theme.colors.error,
        fontFamily:'AbhayaLibre-Regular',
      },
    link: {
      color: '#0000ff',
      textDecorationLine: 'underline',
    },
    loginButton: {
      width: '100%',
      minWidth: 48,
      minHeight: 48,
      paddingHorizontal: 32,
      paddingVertical: 16,
      backgroundColor: theme.fonts.fontEight,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      marginBottom: 30,
    },
    loginButtonText: {
      color: theme.fonts.fontOne,
      fontSize: 18,
      fontFamily:'AbhayaLibre-Regular'
    },
    forgotPassword: {
      
      color: theme.fonts.fontEight,
      textDecorationLine: 'underline',
      fontFamily:'AbhayaLibre-Regular'
    },
  });

  export default styles;