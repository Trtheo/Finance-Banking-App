import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen/ChangePasswordScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen/NotificationSettingsScreen';
import FAQScreen from '../screens/FAQScreen/FAQScreen';

const Stack = createStackNavigator();

export default function ProfileStackNavigation() {
  return (
    <Stack.Navigator
      id="ProfileStack"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
      />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
      />
      <Stack.Screen
        name="FAQ"
        component={FAQScreen}
      />
    </Stack.Navigator>
  );
}
