import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import api from './api';

/**
 * Configure how notifications are displayed
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Register for push notifications and get Expo push token
 */
export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return undefined;
    }
    
    try {
      // Project ID will be read from app.json automatically
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Expo Push Token:', token);
    } catch (error) {
      console.error('Error getting push token:', error);
      return undefined;
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

/**
 * Send push token to backend
 */
export async function registerPushToken(token: string) {
  try {
    console.log(`📡 Posting push token to backend: /api/push/register`);
    const response = await api.post('/push/register', { pushToken: token });
    console.log('✅ Push token registered with backend');
    console.log('📋 Response:', JSON.stringify(response.data));
    return response.data;
  } catch (error: any) {
    console.error('❌ Error registering push token with backend:');
    console.error('   - URL:', error.config?.url);
    console.error('   - Status:', error.response?.status);
    console.error('   - Error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Remove push token from backend (e.g., on logout)
 */
export async function removePushToken() {
  try {
    await api.delete('/push/remove');
    console.log('Push token removed from backend');
  } catch (error) {
    console.error('Error removing push token from backend:', error);
  }
}

/**
 * Add listener for notifications received while app is foregrounded
 */
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(callback);
}

/**
 * Add listener for notifications that user interacted with
 */
export function addNotificationResponseReceivedListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

/**
 * Get last notification response (for when app was opened via notification)
 */
export async function getLastNotificationResponse() {
  return await Notifications.getLastNotificationResponseAsync();
}

/**
 * Schedule a local notification (for testing or reminders)
 */
export async function scheduleLocalNotification(
  title: string,
  body: string,
  data?: any,
  seconds: number = 1
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: { 
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds 
    },
  });
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllScheduledNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Get notification badge count
 */
export async function getBadgeCount() {
  return await Notifications.getBadgeCountAsync();
}

/**
 * Set notification badge count
 */
export async function setBadgeCount(count: number) {
  await Notifications.setBadgeCountAsync(count);
}

/**
 * Clear badge count
 */
export async function clearBadgeCount() {
  await Notifications.setBadgeCountAsync(0);
}
