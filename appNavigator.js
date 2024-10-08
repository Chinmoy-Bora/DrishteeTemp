// AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/Login/LoginScreen';
import TabBar from './src/screens/TabBar/TabBar';
import ExpenseBaseScreen from './src/screens/Expense/ExpenseBaseScreen';
import LocalConveyanceScreen from './src/screens/Expense/LocalConveyance/LocalConveyanceScreen';
import LocalConveyanceForm from './src/screens/Expense/LocalConveyance/LocalConveyanceForm';
import ProfileScreen from './src/screens/ProfileScreen/Profile';
import HomeScreen from './src/screens/Home/HomeScreen';
import CSPScreen from './src/screens/CSP/CSPScreen';
import ChooseCSP from './src/screens/CSP/ChooseCSPScreens/ChooseCSP';
import OtherExpenseScreen from './src/screens/Expense/OtherExpenses/OtherExpenseScreen';
import OtherExpenseForm from './src/screens/Expense/OtherExpenses/OtherExpenseForm';
import TravelEpenseScreen from './src/screens/Expense/TravelExpense/TravelExpenseScreen';
import TravelExpenseForm from './src/screens/Expense/TravelExpense/TravelExpenseForm';
import OfficeExpenseScreen from './src/screens/Expense/OfficeExpense/OfficeExpenseScreen';
import OfficeExpenseForm from './src/screens/Expense/OfficeExpense/OfficeExpenseForm';
import AttendanceScreen from './src/screens/Attendance/AttendanceScreen';
import TourListScreen from './src/screens/Expense/TravelExpense/TourList/TourListScreen';
import ConveyanceForm from './src/screens/Expense/TravelExpense/TourList/Conveyance/ConveyanceForm';
import FoodExpenseFrom from './src/screens/Expense/TravelExpense/TourList/Food/FoodExpenseForm';
import AccommodationForm from './src/screens/Expense/TravelExpense/TourList/Accommodation/AccommodationForm';
import TravelOtherExpenseForm from './src/screens/Expense/TravelExpense/TourList/TravelOtherExpense/TravelOtherExpenseForm';
import ViewExpenseScreen from './src/screens/Expense/ViewExpenses/ViewExpenseScreen';
import StatisticsScreen from './src/screens/Expense/Statistics/StatisticsScreen';
import ReportScreen from './src/screens/Expense/Reports/ReportScreen';
import FormScreen from './src/screens/CSP/FormScreen';

const Stack = createStackNavigator();

const AppNavigator = ({ initialRoute }) => {
  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Tab" component={TabBar} />
      <Stack.Screen name="Expense" component={ExpenseBaseScreen} />
      <Stack.Screen name="LocalConveyance" component={LocalConveyanceScreen} />
      <Stack.Screen name="LocalConveyanceForm" component={LocalConveyanceForm} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CSP" component={CSPScreen} />
      <Stack.Screen name="ChooseCSP" component={ChooseCSP} />
      <Stack.Screen name="OtherExpense" component={OtherExpenseScreen} />
      <Stack.Screen name="OtherExpenseForm" component={OtherExpenseForm} />
      <Stack.Screen name="TravelExpense" component={TravelEpenseScreen} />
      <Stack.Screen name="TravelExpenseForm" component={TravelExpenseForm} />
      <Stack.Screen name="OfficeExpense" component={OfficeExpenseScreen} />
      <Stack.Screen name="OfficeExpenseForm" component={OfficeExpenseForm} />
      <Stack.Screen name="Attendance" component={AttendanceScreen} />
      <Stack.Screen name="TourList" component={TourListScreen} />
      <Stack.Screen name="TourListConveyance" component={ConveyanceForm} />
      <Stack.Screen name="FoodExpense" component={FoodExpenseFrom} />
      <Stack.Screen name="AccommodationForm" component={AccommodationForm} />
      <Stack.Screen name="TravelOtherExpense" component={TravelOtherExpenseForm} />
      <Stack.Screen name="ViewExpense" component={ViewExpenseScreen} />
      <Stack.Screen name="Statistics" component={StatisticsScreen} />
      <Stack.Screen name="Reports" component={ReportScreen} />
      <Stack.Screen name="CSPForm" component={FormScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
