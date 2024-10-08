import { StyleSheet, Platform } from 'react-native';
import theme from '../../utils/theme';

const styles = StyleSheet.create({

    container: {
        flex: 1,
        height:"100%",
        backgroundColor: theme.colors.primary,
      },
      maincontainer:{
       
        height:"100%",
        width:'100%',
        backgroundColor: theme.colors.primary,
        alignItems:'center',
        paddingTop:'4%'
      },
      modules:
      {
        width:'90%',
        height:'10%',
        borderRadius:'10%',
        backgroundColor:'blue',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        
      },

      contentContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
      },
      // emptyStateContainer: {
      //   flex: 1,
      //   justifyContent: 'center',
      //   alignItems: 'center',
      // },
      noDataText: {
        color: "#000",
        fontSize: 16,
        marginTop:20
      },

})

export default styles;