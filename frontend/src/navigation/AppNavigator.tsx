import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import RegistrationScreen from "../screens/RegistrationScreen/RegistrationScreen";
import LoginScreen from "../screens/LoginScreen/LoginScreen";
import SplashScreen from "../screens/SplashScreen/SplashScreen";
import TabNavigator from "./TabNavigator";
import FundTransferScreen from "../screens/FundTransferScreen/FundTransferScreen";
import TransactionsScreen from "../screens/TransactionsScreen/TransactionsScreen";
import AddCardScreen from "../screens/AddCardScreen/AddCardScreen";
import CardDetailsScreen from "../screens/CardDetailsScreen/CardDetailsScreen";
import OTPVerificationScreen from "../screens/OTPVerificationScreen/OTPVerificationScreen";
import NotificationScreen from "../screens/NotificationScreen/NotificationScreen";
import DepositScreen from "../screens/DepositScreen/DepositScreen";
import WithdrawScreen from "../screens/WithdrawScreen/WithdrawScreen";
import CardManagementScreen from "../screens/CardManagementScreen/CardManagementScreen";
import InternetPaymentScreen from "../screens/InternetPaymentScreen/InternetPaymentScreen";
import InternetPaymentSummaryScreen from "../screens/InternetPaymentSummaryScreen/InternetPaymentSummaryScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        id="MainStack"
        screenOptions={{ headerShown: false }}
        initialRouteName="SplashScreen"
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="FundTransfer" component={FundTransferScreen} />
        <Stack.Screen name="Deposit" component={DepositScreen} />
        <Stack.Screen name="Withdraw" component={WithdrawScreen} />
        <Stack.Screen name="CardManagement" component={CardManagementScreen} />
        <Stack.Screen name="Transactions" component={TransactionsScreen} />
        <Stack.Screen name="AddCard" component={AddCardScreen} />
        <Stack.Screen name="CardDetails" component={CardDetailsScreen} />
        <Stack.Screen name="InternetPayment" component={InternetPaymentScreen} />
        <Stack.Screen name="InternetPaymentSummary" component={InternetPaymentSummaryScreen} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
