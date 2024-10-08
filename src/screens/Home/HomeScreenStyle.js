import { StyleSheet, Platform, PlatformColor } from 'react-native';
import theme from "../../utils/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundFive,//FEFCFF
  },
  headtextcontainer:{
    flexDirection: 'column',

  },
  header: {
    width: '100%',
    paddingHorizontal:20,
    paddingTop:30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundFive,

    zIndex: 1,
   
  },
  image:{
    height:30,
    width:30,
  },
  greeting: {
    fontSize: 22, 
    color: theme.fonts.fontTwo,
    fontWeight:'600',
    fontFamily:'AbhayaLibre-Bold'
  },
  logoutcontainer:{
    shadowColor: theme.colors.backgroundThree,
width:40,
height:40,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 5,
    borderRadius:10,
    backgroundColor:theme.colors.backgroundFive,
alignContent:'center',
justifyContent:'center', 
alignItems:'center',
  },
  logoutIcon: {
    width: '45%', 
    height: '45%',
    
    tintColor: theme.colors.tertiary, 

  },
  content: {
    flex: 1,
    alignItems: 'center',
    
  },

  messagesSection: {
    width: '100%',
    marginBottom :80,
    alignItems: 'center',
  },
  workspaceSection: {
    backgroundColor:theme.colors.backgroundFive,
    height:'100%',
    borderRadius:10,
    width: '100%',
    marginTop : 20,
    alignItems: 'flex-start',
  },
  subheader: {
    fontSize: 12,
    fontWeight:'600',
    color: theme.fonts.fontFour,
    marginVertical: 5,
    textAlign: 'left',
  },
  subTitle: {
    width: '100%',
    fontSize: 16,
    
    fontFamily: 'AbhayaLibre-Bold',
    color: theme.fonts.fontEight,
    marginVertical: 15,
    textAlign: 'left',
    paddingHorizontal: 20,
  },
  cardContainer: {

    flexDirection: 'row',          // Arrange items in a row
    flexWrap: 'wrap',              // Wrap items to the next line when the row is filled
    justifyContent: 'space-between', // Distribute items evenly with space between them
    paddingHorizontal: 20,
    marginTop: Platform.OS === 'android' ? 0 : -10,
    marginBottom: Platform.OS === 'android' ? 20 : 10,
  },

  bottomblank :{
    height: 100,
    width:'100%',
  }
});

export default styles;
