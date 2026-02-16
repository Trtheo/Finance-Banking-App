import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import AppNavigator from "./src/navigation/AppNavigator";
import {
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
} from "./src/services/notificationService";

export default function App() {
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  useEffect(() => {
    // Set up notification listeners (works even before login)
    // Listener for notifications received while app is foregrounded
    notificationListener.current = addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received in foreground:", notification);
      },
    );

    // Listener for when user taps on notification
    responseListener.current = addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notification tapped:", response);
        const data = response.notification.request.content.data;

        // Handle navigation based on notification type
        if (data.type) {
          // You can navigate to specific screens based on notification type
          // For example: navigation.navigate('TransactionHistory')
        }
      },
    );

    return () => {
      // Cleanup listeners
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <AppNavigator />
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

/**
 * If you are not familiar with React Navigation, we recommend going through the
 * "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
 *
 */
