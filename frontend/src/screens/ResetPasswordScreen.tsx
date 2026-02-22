import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ResetPasswordScreen({ navigation, route }: any) {
    const { method, value } = route.params || {};
    const [step, setStep] = useState<'otp' | 'password'>('otp');
    const [otp, setOtp] = useState(['', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const inputRefs = useRef<(TextInput | null)[]>([]);

    const handleOtpChange = (text: string, index: number) => {
        if (!/^\d*$/.test(text)) return;
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
        if (text && index < 4) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOtp = () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 5) {
            setError('Please enter the complete 5-digit code');
            return;
        }
        setError('');
        console.log('Verifying OTP:', otpCode);
        setStep('password');
    };

    const handleResetPassword = () => {
        if (!newPassword || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setError('');
        console.log('Resetting password');
        navigation.navigate('PasswordResetSuccess');
    };

    const handleResendCode = () => {
        setError('');
        setSuccessMessage('A new code has been sent');
        setOtp(['', '', '', '', '']);
        inputRefs.current[0]?.focus();
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>

            <Text style={styles.title}>Forgot Password</Text>

            <View style={styles.content}>

                {step === 'otp' ? (
                    <View style={styles.card}>
                        <View style={styles.iconContainer}>
                            <View style={styles.iconCircle}>
                                <Ionicons 
                                    name={method === 'email' ? 'mail' : 'call'} 
                                    size={40} 
                                    color="#FFD700" 
                                />
                            </View>
                        </View>

                        <Text style={styles.heading}>Verify Your {method === 'email' ? 'Email' : 'Phone'}</Text>
                        <Text style={styles.subtitle}>
                            Enter the 5 digit code we sent to{'\n'}
                            <Text style={styles.value}>{value}</Text>
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
                                    onChangeText={(text) => handleOtpChange(text, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    selectTextOnFocus
                                />
                            ))}
                        </View>
                        {error && <Text style={styles.errorText}>{error}</Text>}

                        <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
                            <Text style={styles.buttonText}>Verify</Text>
                        </TouchableOpacity>

                        <View style={styles.resendContainer}>
                            <Text style={styles.resendText}>Didn't receive the code? </Text>
                            <TouchableOpacity onPress={handleResendCode}>
                                <Text style={styles.resendLink}>Resend Code</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.card}>
                        <Text style={styles.heading}>Create a New Password</Text>
                        <Text style={styles.subtitle}>Enter your new password</Text>

                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="key-outline" size={20} color="#666" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••••"
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={!showNewPassword}
                            />
                            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                                <Ionicons
                                    name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Confirmation New Password</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="key-outline" size={20} color="#666" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••••"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <Ionicons
                                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                        {error && <Text style={styles.errorText}>{error}</Text>}

                        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 40,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 20,
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
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 25,
    },
    value: {
        color: '#333',
        fontWeight: '600',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        marginBottom: 30,
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
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
        marginTop: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEE',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        backgroundColor: '#F9F9F9',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    icon: {
        marginRight: 10,
    },
    button: {
        backgroundColor: '#FFD700',
        borderRadius: 25,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 30,
    },
    buttonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
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
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 5,
    },
});
