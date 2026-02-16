# 🚀 Quick Start: Push Notifications Setup

## ✅ What's Been Implemented

Push notifications have been fully integrated into your Finance Banking App! Here's what was done:

### Backend Changes
- ✅ Added `pushToken` field to User model
- ✅ Created push notification service (`pushNotification.service.ts`)
- ✅ Created push notification controller and routes
- ✅ Integrated push notifications with transaction notifications
- ✅ Added API endpoints: 
  - `POST /api/push/register` - Register push token
  - `DELETE /api/push/remove` - Remove push token

### Frontend Changes
- ✅ Installed `expo-notifications` and `expo-device` packages
- ✅ Created push notification service
- ✅ Updated App.tsx with notification handlers
- ✅ Created app.json with Expo configuration
- ✅ Integrated with existing notification service

## 🎯 Next Steps (Required)

### 1. Update Expo Project ID

You need to replace `'your-project-id'` in TWO files:

**File 1:** `frontend/src/services/pushNotificationService.ts` (Line ~51)
```typescript
token = (await Notifications.getExpoPushTokenAsync({
  projectId: 'YOUR_ACTUAL_PROJECT_ID_HERE', // ← Change this
})).data;
```

**File 2:** `frontend/app.json` (Line ~43)
```json
"extra": {
  "eas": {
    "projectId": "YOUR_ACTUAL_PROJECT_ID_HERE"  // ← Change this
  }
}
```

### 2. Get Your Expo Project ID

Run these commands in your terminal:

```bash
# Install EAS CLI globally (if not already installed)
npm install -g eas-cli

# Navigate to frontend directory
cd frontend

# Login to Expo
eas login

# Initialize EAS project
eas init
```

This will:
- Create an Expo project for you
- Automatically update `app.json` with your project ID
- Show your project ID in the terminal

Copy the project ID and update it in `pushNotificationService.ts` as well.

## 🧪 Testing

### Option 1: Test on Physical Device (Recommended)

1. Start your backend:
   ```bash
   cd backend
   npm run dev
   ```

2. Start your frontend:
   ```bash
   cd frontend
   npm start
   ```

3. Scan the QR code:
   - **iOS**: Use Camera app
   - **Android**: Use Expo Go app

4. The app will automatically request notification permissions

5. Test by making a transaction (deposit, withdrawal, or transfer)

### Option 2: Test on Android Emulator

1. Start Android emulator

2. Start backend and frontend (same as above)

3. Press `a` in the Metro bundler terminal to open on Android

4. Perform a transaction to receive a notification

**Note:** iOS Simulator does NOT support push notifications. Use a physical iOS device instead.

## 🔍 Verify It's Working

### Check Frontend Logs
You should see in your console:
```
Expo Push Token: ExponentPushToken[xxxxxxxxxxxxx]
Push token registered with backend
```

### Check Backend Logs
You should see:
```
Updated push token for user [userId]
Push notification sent to user [userId]
```

### Test Notification Flow

1. **Login** to your app
2. **Make a deposit** or **withdrawal**
3. You should receive:
   - ✅ In-app notification (visible in NotificationScreen)
   - ✅ Email notification
   - ✅ Push notification (on your device)

## 📱 Notification Permissions

When you first open the app, it will ask for notification permissions:
- **iOS**: Shows a system dialog
- **Android**: Usually grants automatically

If you denied permissions:
1. Go to device Settings
2. Find your app
3. Enable Notifications

## 🐛 Troubleshooting

### "Must use physical device for Push Notifications"
- **Solution**: Use a physical device or Android Emulator (not iOS Simulator)

### Push token not showing in logs
- **Solution**: Check that you have internet connection and are logged in

### Notifications not appearing
1. Check device notification settings
2. Ensure app is not in Do Not Disturb mode
3. Verify backend is running and reachable

### Invalid Expo push token format
- **Solution**: Make sure you updated the project ID in both files

## 📖 Full Documentation

For detailed information, see:
- [PUSH_NOTIFICATIONS.md](./PUSH_NOTIFICATIONS.md) - Complete implementation guide
- Includes advanced usage, production setup, and security notes

## 🎉 You're All Set!

Once you:
1. ✅ Update the Expo project ID in both files
2. ✅ Run `eas init` to register your project
3. ✅ Test on a physical device or Android Emulator

Your push notifications will be fully functional!

---

**Need Help?** Check the troubleshooting section or the full documentation.
