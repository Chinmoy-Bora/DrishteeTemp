import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#081c25',
  },
  header: {
    backgroundColor: '#FFCC00',
      paddingVertical: 15,
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: '#000',
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
    color: '#fff',
    marginBottom: 10,
    marginTop:5,
  },
  inputRow: {
    color:'#000',
    fontSize: 16,
    
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f1f1f', 
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    fontWeight:'500'

  },
  input: {
    flex: 1,
    color: '#000', 
    fontSize: 16,
    fontWeight:'500'
  },
  remarksInput: {
    fontWeight:'bold',
    height: 100,
    borderWidth: 1,
    borderColor: '#1f1f1f', 
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: '#000',
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
    backgroundColor: '#FFCC00',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom:50
  },
  submitButtonText: {
    color: '#000', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  dropdownContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 40,
    borderRadius: 8,
    padding: 10,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 0.5,
  },
  dropdownItemText: {
    color: '#000',
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
    borderColor: 'red',
    borderWidth: 2,
    alignItems: 'center',
  },
});

export default styles;
