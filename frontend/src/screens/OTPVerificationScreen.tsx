import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function OTPVerificationScreen({ navigation, route }: any) {
    const { email } = route.params || { email: 'user@example.com' };
    const [otp, setOtp] = useState(['', '', '', '', '']);
    const [successMessage, setSuccessMessage] = useState('');
    const inputRefs = useRef<(TextInput | null)[]>([]);

    const handleOtpChange = (value: string, index: number) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 4) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 5) {
            Alert.alert('Error', 'Please enter the complete 5-digit code');
            return;
        }

        console.log('Verifying OTP:', otpCode);
        // TODO: Implement API call
        navigation.navigate('Login');
    };

    const handleResendCode = () => {
        setSuccessMessage('A new code has been sent to your email');
        setOtp(['', '', '', '', '']);
        inputRefs.current[0]?.focus();
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>

            <View style={styles.content}>
                <Text style={styles.title}>Verification</Text>

                <View style={styles.iconContainer}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="mail" size={40} color="#FFD700" />
                    </View>
                </View>

                <Text style={styles.heading}>Please Verify Your Email</Text>
                <Text style={styles.subtitle}>
                    Enter the 5 digit code we sent by email to{'\n'}
                    <Text style={styles.email}>{email}</Text>
                </Text>

                {successMessage && (
                    <View style={styles.successBanner}>
                        <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                        <Text style={styles.successText}>{successMessage}</Text>
                    </View>
                )}

                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            style={[styles.otpInput, digit && styles.otpInputFilled]}
                            value={digit}
                            onChangeText={(value) => handleOtpChange(value, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            selectTextOnFocus
                        />
                    ))}
                </View>

                <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
                    <Text style={styles.verifyButtonText}>Verify</Text>
                </TouchableOpacity>

                <View style={styles.resendContainer}>
                    <Text style={styles.resendText}>Didn't receive the code? </Text>
                    <TouchableOpacity onPress={handleResendCode}>
                        <Text style={styles.resendLink}>Resend Code</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    backButton: {
        padding: 20,
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 40,
    },
    iconContainer: {
        marginBottom: 30,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E8E8E8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 20,
    },
    email: {
        color: '#333',
        fontWeight: '600',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        marginBottom: 40,
    },
    otpInput: {
        width: 50,
        height: 60,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E8E8E8',
        backgroundColor: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    otpInputFilled: {
        borderColor: '#FFD700',
    },
    verifyButton: {
        width: '100%',
        backgroundColor: '#FFD700',
        borderRadius: 25,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    verifyButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resendText: {
        fontSize: 14,
        color: '#888',
    },
    resendLink: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
    },
    successBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginBottom: 20,
        gap: 8,
    },
    successText: {
        color: '#34C759',
        fontSize: 14,
        fontWeight: '500',
    },
});
