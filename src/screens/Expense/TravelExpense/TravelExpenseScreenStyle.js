import { StyleSheet } from 'react-native';
import theme from '../../../utils/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: theme.colors.headerColor,
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {},
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.fonts.fontOne,
    marginLeft: 10,
  },
  tabContainer: {
    marginHorizontal:10,
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    marginBottom: 10,
    marginTop:10,
  },
  tabItem: {
    height: 40,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    alignItems:'center',
    justifyContent:'center',
    borderColor:theme.colors.borderThree,

  },
  activeTabItem: {
    backgroundColor: theme.colors.backgroundFour,
    borderColor: theme.colors.secondary,
  },
  tabText: {
    fontSize:12,
    color: theme.fonts.fontThree,
  },
  activeTabText: {
    color:theme.colors.secondary,
    fontSize:12,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center', 
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  
  expensesList: {
    color: theme.colors.primary,
    fontSize: 20,
    marginVertical: 10,
  },
  emptyStateContainer: {
    justifyContent: 'center', 
    alignItems: 'center', 
    flex: 1,
  },
  emptyStateImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  noDataText: {
    color: theme.fonts.fontTwo,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    backgroundColor: theme.colors.secondary,
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center', 
    alignItems: 'center',  
    bottom: 20, 
    right: 20, 
  },
  fabIcon: {
    fontSize: 40,
    color: theme.colors.primary,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#02024220',
  },
  tableCellLabel: {
    fontSize: 14,
    color: theme.fonts.fontTwo,
    fontWeight: '500',
    flex: 1,
  },
  tableCellValue: {
    fontSize: 14  ,
    color: theme.fonts.fontTwo, 
    flex: 1,
    fontWeight: '500',
    textAlign: 'right',
  },
  

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal:30
  },
  submitButton: {
    backgroundColor: theme.colors.secondary,
    padding: 10,
    paddingHorizontal:20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: theme.colors.tertiary,
    padding: 10,
    paddingHorizontal:20,
    borderRadius: 5,
  },
  buttonText: {
    color: theme.fonts.fontOne,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default styles;
