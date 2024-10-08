import { StyleSheet } from "react-native";
import theme from "../../../utils/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: theme.colors.primary,
  },
  maincontainer: {
    height: "100%",
    backgroundColor: theme.colors.tertiary,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.fonts.fontSeven,
    textAlign: 'center',
    padding: 20,
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: theme.fonts.fontSeven,
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
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
    flex: 2,
    textAlign: 'right',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.fonts.fontSeven,
    marginBottom: 8,
  },
  sectionStatus: {
    fontSize: 16,
    color: theme.fonts.fontOne, // White color for the text
    marginBottom: 8,
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  documentsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileContainer: {
    width: '22%', // Ensures 4 items fit in one row
    marginVertical: 10,
    alignItems: 'center',
  },
  billImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  fullImagePreview: {
    width: '90%',
    height: '90%',
    borderRadius: 10,
  },
  applyButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 20,
    marginTop:20,
    marginHorizontal:20,
    alignItems: "center",
  },
  applyButtonText: {
    color: theme.fonts.fontOne,
    fontWeight: "bold",
    fontSize: 18,
  },
  ClarificationContainer:{
    marginBottom:30
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: theme.fonts.fontOne,
    borderRadius: 10,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.secondary,
  },
  closeButton: {
    fontSize: 22,
    color: theme.colors.secondary,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
    fontSize: 16,
  },
  textArea: {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    fontSize: 16,
    height: 100,
  },
  submitButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
  },
  submitButtonText: {
    color: theme.fonts.fontOne,
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorInput: {
    borderColor: 'red', 
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
});

export default styles;
