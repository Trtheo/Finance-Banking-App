# Push Notifications Implementation Guide

This guide explains how push notifications have been implemented in your Finance Banking App using Expo Push Notifications.

## Overview

Push notifications are now integrated into your app and will automatically be sent when:

- A deposit is made to a wallet
- A withdrawal is made from a wallet
- A transfer is sent or received

## Architecture

### Backend Components

1. **User Model** (`backend/src/models/User.ts`)
   - Added `pushToken` field to store user's Expo push token

2. **Push Notification Service** (`backend/src/services/pushNotification.service.ts`)
   - `sendPushNotification()` - Send push notification to a single user
   - `sendPushNotificationBatch()` - Send push notifications to multiple users
   - `updateUserPushToken()` - Store user's push token
   - `removeUserPushToken()` - Remove push token (on logout)

3. **Push Notification Controller** (`backend/src/controllers/pushNotificationController.ts`)
   - `registerPushToken` - API endpoint to register push tokens
   - `removePushToken` - API endpoint to remove push tokens

4. **Routes** (`backend/src/routes/pushNotificationRoutes.ts`)
   - `POST /api/push/register` - Register/update push token
   - `DELETE /api/push/remove` - Remove push token

5. **Integration** (`backend/src/services/inAppNotification.service.ts`)
   - Automatically sends push notifications when in-app notifications are created

### Frontend Components

1. **Push Notification Service** (`frontend/src/services/pushNotificationService.ts`)
   - `registerForPushNotificationsAsync()` - Request permissions and get push token
   - `registerPushToken()` - Send token to backend
   - `removePushToken()` - Remove token from backend
   - Notification listeners and handlers

2. **App Integration** (`frontend/App.tsx`)
   - Automatically registers for push notifications on app start
   - Sets up listeners for foreground notifications
   - Handles user interactions with notifications

3. **Configuration** (`frontend/app.json`)
   - Expo configuration for push notifications

## Setup Instructions

### 1. Frontend Configuration

Update the Expo project ID in two places:

**File: `frontend/src/services/pushNotificationService.ts`**

```typescript
token = (
  await Notifications.getExpoPushTokenAsync({
    projectId: "your-project-id", // Replace with your actual Expo project ID
  })
).data;
```

**File: `frontend/app.json`**

```json
"extra": {
  "eas": {
    "projectId": "your-project-id"  // Replace with your actual Expo project ID
  }
}
```

### 2. Get Your Expo Project ID

If you don't have an Expo account and project yet:

1. Install EAS CLI:

   ```bash
   npm install -g eas-cli
   ```

2. Log in to Expo:

   ```bash
   eas login
   ```

3. Initialize your project:

   ```bash
   cd frontend
   eas init
   ```

4. Your project ID will be displayed and automatically added to `app.json`

### 3. Testing Push Notifications

#### Option A: Physical Device (Recommended)

Push notifications work best on physical devices:

1. Start the development server:

   ```bash
   cd frontend
   npm start
   ```

2. Scan the QR code with:
   - iOS: Camera app
   - Android: Expo Go app

3. The app will automatically:
   - Request notification permissions
   - Register for push notifications
   - Send the token to your backend

#### Option B: iOS Simulator / Android Emulator

Note: Push notifications don't work in iOS Simulator, but work in Android Emulator.

### 4. Verify Registration

Check your backend logs when the app starts. You should see:

```
Updated push token for user [userId]
```

### 5. Test Notifications

Perform any transaction (deposit, withdrawal, or transfer) and you should receive:

- An in-app notification
- An email notification
- A push notification on your device

## How It Works

### Flow Diagram

```
Transaction Occurs → createInAppNotification()
                    ↓
        ┌───────────┴───────────┐
        ↓                       ↓
  In-App Notification    Push Notification
  (MongoDB)              (Expo Push Service)
                              ↓
                         User's Device
```

### Notification Lifecycle

1. **User Registration**
   - User opens app
   - App requests notification permissions
   - If granted, gets Expo push token
   - Sends token to backend via `POST /api/push/register`
   - Backend stores token in User model

2. **Transaction Occurs**
   - User performs deposit/withdrawal/transfer
   - `createInAppNotification()` is called
   - Function creates in-app notification in MongoDB
   - Function calls `sendPushNotification()` (non-blocking)
   - Push notification sent via Expo Push API

3. **User Receives Notification**
   - If app is in foreground: Handled by `notificationListener`
   - If app is in background/closed: Shows as system notification
   - If user taps notification: Handled by `responseListener`

## Notification Permissions

The app will automatically request notification permissions on first launch.

Users can:

- View notifications in the NotificationScreen
- Enable/disable notifications in device settings
- Clear notification badge

## Troubleshooting

### Push Notifications Not Working

1. **Check if running on physical device**
   - iOS Simulator doesn't support push notifications
   - Must use physical iOS device or Android Emulator/Device

2. **Check permissions**
   - Go to device Settings → App → Notifications
   - Ensure notifications are enabled

3. **Check push token registration**
   - Look for "Expo Push Token:" in console logs
   - Verify token starts with "ExponentPushToken[" or "ExpoPushToken["

4. **Check backend logs**
   - Should see "Push notification sent to user [userId]"
   - If seeing "No push token found", user needs to reopen app

5. **Verify Expo project ID**
   - Ensure project ID is set in both files
   - Project ID should match your Expo account

### Common Issues

**Issue: "Must use physical device for Push Notifications"**

- Solution: Test on a physical device or Android Emulator

**Issue: Push token not registered**

- Solution: Ensure user is logged in and app has network connection

**Issue: Notifications not showing**

- Solution: Check notification permissions in device settings

**Issue: "Invalid Expo push token format"**

- Solution: Ensure you're using the correct project ID in configuration

## API Endpoints

### Register Push Token

```http
POST /api/push/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "pushToken": "ExponentPushToken[xxxxxxxxxxxxxx]"
}
```

### Remove Push Token

```http
DELETE /api/push/remove
Authorization: Bearer <token>
```

## Advanced Usage

### Send Custom Notification

You can send custom push notifications programmatically:

```typescript
import { sendPushNotification } from "./services/pushNotification.service";

await sendPushNotification({
  userId: "user-id",
  title: "Custom Notification",
  body: "This is a custom message",
  data: {
    type: "CUSTOM",
    customData: "any-data",
  },
});
```

### Batch Notifications

Send to multiple users at once:

```typescript
import { sendPushNotificationBatch } from "./services/pushNotification.service";

await sendPushNotificationBatch(
  ["user-id-1", "user-id-2", "user-id-3"],
  "Batch Notification",
  "This notification was sent to multiple users",
  { type: "ANNOUNCEMENT" },
);
```

### Handle Notification Tap

Navigate to specific screens when user taps notification:

**File: `frontend/App.tsx`**

```typescript
responseListener.current = addNotificationResponseReceivedListener(
  (response) => {
    const data = response.notification.request.content.data;

    if (data.type === "DEPOSIT") {
      // Navigate to transaction history
      navigationRef.current?.navigate("TransactionHistory");
    } else if (data.type === "TRANSFER_RECEIVED") {
      // Navigate to wallet screen
      navigationRef.current?.navigate("Wallet");
    }
  },
);
```

## Production Considerations

### 1. Expo Application Services (EAS)

For production apps, you'll need to:

1. Build your app with EAS:

   ```bash
   eas build --platform all
   ```

2. Configure push notification credentials:

   ```bash
   eas credentials
   ```

3. Submit to app stores:
   ```bash
   eas submit
   ```

### 2. Badge Count Management

Update badge count when viewing notifications:

```typescript
import { clearBadgeCount } from "./services/notificationService";

// When user opens notification screen
useEffect(() => {
  clearBadgeCount();
}, []);
```

### 3. Rate Limiting

Consider implementing rate limiting on the backend to prevent notification spam:

```typescript
// Example: Limit to 10 notifications per user per hour
const canSendNotification = await checkRateLimit(userId);
if (!canSendNotification) {
  return { success: false, reason: "Rate limit exceeded" };
}
```

### 4. Notification Categories

Add notification categories for better organization:

```typescript
await Notifications.setNotificationCategoryAsync("transaction", [
  {
    identifier: "view",
    buttonTitle: "View Details",
    options: { opensAppToForeground: true },
  },
  {
    identifier: "dismiss",
    buttonTitle: "Dismiss",
    options: { isDestructive: true },
  },
]);
```

## Security Notes

1. Push tokens are sensitive - they're stored securely in the database
2. Only authenticated users can register/remove push tokens
3. Backend validates token format before storing
4. Tokens are automatically removed on logout
5. Failed push notifications are logged but don't throw errors

## Further Reading

- [Expo Push Notifications Documentation](https://docs.expo.dev/push-notifications/overview/)
- [Firebase Cloud Messaging (alternative)](https://firebase.google.com/docs/cloud-messaging)
- [APNs (Apple Push Notification service)](https://developer.apple.com/documentation/usernotifications)

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review console logs in both frontend and backend
3. Verify your Expo project configuration
4. Ensure all dependencies are installed correctly

---

**Last Updated:** February 2026
**Version:** 1.0.0
