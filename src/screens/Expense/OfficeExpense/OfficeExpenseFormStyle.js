import { StyleSheet } from 'react-native';
import theme from '../../../utils/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundOne,
  },
  header: {
    backgroundColor: theme.colors.backgroundTwo,
      paddingVertical: 15,
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: theme.fonts.fontTwo,
    marginLeft: 10,
    fontWeight: 'bold',

  },
  headerIcon:{
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: theme.fonts.fontOne,
    marginBottom: 10,
    marginTop:5,
  },
  inputRow: {
    color:theme.fonts.fontTwo,
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderTwo, 
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: theme.colors.primary,
    fontWeight:'500'

  },
  input: {
    flex: 1,
    color: theme.fonts.fontTwo, 
    fontSize: 16,
    fontWeight:'500'
  },
  remarksInput: {
    fontWeight:'bold',
    height: 100,
    borderWidth: 1,
    borderColor: theme.colors.borderTwo, 
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: theme.colors.primary,
    color: theme.fonts.fontTwo,
    fontSize: 16,
    textAlignVertical: 'top', 
  },
  expenseTypeInput: {
    marginLeft: 10,
  },
  icon: {
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: theme.colors.backgroundTwo,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom:40
  },
  submitButtonText: {
    color: theme.fonts.fontTwo, 
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  dropdownContainer: {
    backgroundColor: theme.colors.primary,
    marginHorizontal: 40,
    borderRadius: 8,
    padding: 10,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: theme.colors.borderOne,
    borderBottomWidth: 0.5,
  },
  dropdownItemText: {
    color: theme.fonts.fontTwo,
    fontSize: 14,
    fontWeight:'400'
  },
  iconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 10, 
  },
  errorInput: {
    borderColor: theme.colors.error,
    borderWidth: 2,
    alignItems: 'center',
  },
});

export default styles;
