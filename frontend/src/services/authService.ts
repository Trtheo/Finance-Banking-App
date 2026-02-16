import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForPushNotificationsAsync, registerPushToken } from './pushNotificationService';

export const login = async (identifier: string, password: string) => {
    const response = await api.post('/auth/login', { identifier, password });
    return response.data;
};

export const verifyOtp = async (userId: string, otp: string) => {
    const response = await api.post('/auth/verify-otp', { userId, otp });
    if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data));
        // Register push token after authentication
        await registerPushTokenAfterLogin();
    }
    return response.data;
};

export const register = async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data));
        // Register push token after authentication
        await registerPushTokenAfterLogin();
    }
    return response.data;
};

export const getMe = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

export const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
};

/**
 * Register push token with backend after user is authenticated
 */
const registerPushTokenAfterLogin = async () => {
    try {
        console.log('🔔 Starting push token registration after login...');
        const token = await registerForPushNotificationsAsync();
        
        if (token) {
            console.log(`📱 Got push token: ${token.substring(0, 40)}...`);
            console.log(`📤 Sending push token to backend...`);
            await registerPushToken(token);
            console.log('✅ Push token registered with backend after login');
        } else {
            console.log('⚠️ No push token received from device');
        }
    } catch (error) {
        console.error('❌ Failed to register push token after login:', error);
        // Don't fail login if push notification registration fails
    }
};
