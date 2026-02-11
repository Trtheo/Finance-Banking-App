import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as authService from '../services/authService';
import * as transactionService from '../services/transactionService';

// @ts-ignore
export default function OTPVerificationScreen({ navigation, route }) {
    const { userId, email, type, amount, description } = route.params || {};
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleVerify = async () => {
        if (otp.length !== 6) {
            Alert.alert('Error', 'Please enter a valid 6-digit OTP');
            return;
        }

        try {
            setIsLoading(true);
            
            if (type === 'withdraw') {
                await transactionService.withdraw(amount, description);
                Alert.alert('Success', `Withdrawal of RWF ${Number(amount).toLocaleString()} completed successfully!`, [
                    { text: 'OK', onPress: () => navigation.navigate('Main') }
                ]);
            } else if (type === 'deposit') {
                await transactionService.deposit(amount, description);
                Alert.alert('Success', `Deposit of RWF ${Number(amount).toLocaleString()} completed successfully!`, [
                    { text: 'OK', onPress: () => navigation.navigate('Main') }
                ]);
            } else {
                await authService.verifyOtp(userId, otp);
                Alert.alert('Success', 'Logged in successfully!', [
                    { text: 'OK', onPress: () => navigation.replace('Main') }
                ]);
            }
        } catch (error: any) {
            Alert.alert('Verification Failed', error.response?.data?.message || error.message || 'Invalid or expired OTP');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <View style={styles.content}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={28} color="black" />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.logoText}>Nexpay</Text>
                        <Text style={styles.title}>
                            {type === 'withdraw' ? 'Confirm Withdrawal' : 
                             type === 'deposit' ? 'Confirm Deposit' : 'Verification'}
                        </Text>
                        <Text style={styles.subtitle}>
                            {type === 'withdraw' 
                                ? `Enter your PIN to confirm withdrawal of $${amount}` 
                                : type === 'deposit'
                                ? `Enter your PIN to confirm deposit of $${amount}`
                                : `Enter the 6-digit code sent to ${email}`
                            }
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.label}>{(type === 'withdraw' || type === 'deposit') ? 'Enter PIN' : 'OTP Code'}</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="123456"
                                value={otp}
                                onChangeText={setOtp}
                                keyboardType="number-pad"
                                maxLength={6}
                                autoFocus
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.verifyButton, (isLoading || otp.length !== 6) && { opacity: 0.7 }]}
                            onPress={handleVerify}
                            disabled={isLoading || otp.length !== 6}
                        >
                            <Text style={styles.verifyButtonText}>
                                {isLoading ? 'Processing...' : 
                                 type === 'withdraw' ? 'Confirm Withdrawal' :
                                 type === 'deposit' ? 'Confirm Deposit' : 'Verify & Login'}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Didn't receive code? </Text>
                            <TouchableOpacity>
                                <Text style={styles.resendText}>Resend</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    backBtn: {
        width: 40,
        marginBottom: 20,
    },
    header: {
        marginBottom: 30,
        alignItems: 'center',
    },
    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
        marginTop: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEE',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        letterSpacing: 5,
        textAlign: 'center',
    },
    icon: {
        marginRight: 5,
    },
    verifyButton: {
        backgroundColor: '#FFD700',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 30,
    },
    verifyButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        color: '#888',
    },
    resendText: {
        color: '#333',
        fontWeight: 'bold',
    },
});
