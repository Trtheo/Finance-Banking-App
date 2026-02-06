import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import RegistrationScreen from '../screens/RegistrationScreen';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Registration">
                <Stack.Screen name="Registration" component={RegistrationScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Dashboard" component={DashboardScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
