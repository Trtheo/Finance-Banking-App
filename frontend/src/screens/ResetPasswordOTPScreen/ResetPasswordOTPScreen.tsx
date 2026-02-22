import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import CustomModal from '../../components/CustomModal';

// @ts-ignore
export default function ResetPasswordOTPScreen({ navigation, route }) {
    const { email, userId } = route.params;
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modal, setModal] = useState({ visible: false, type: 'error' as 'success' | 'error', title: '', message: '' });

    const handleVerifyOTP = async () => {
        if (otp.length !== 6) {
            setModal({ visible: true, type: 'error', title: 'Error', message: 'Please enter a valid 6-digit OTP' });
            return;
        }

        try {
            setIsLoading(true);
            await api.post('/auth/verify-reset-otp', { userId, otp });
            
            navigation.navigate('ResetPassword', { userId, otp });
        } catch (error: any) {
            setModal({ visible: true, type: 'error', title: 'Error', message: error.response?.data?.message || 'Invalid or expired OTP' });
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
                        <Text style={styles.title}>Verify OTP</Text>
                        <Text style={styles.subtitle}>
                            Enter the 6-digit code sent to {email}
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.label}>OTP Code</Text>
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
                            onPress={handleVerifyOTP}
                            disabled={isLoading || otp.length !== 6}
                        >
                            <Text style={styles.verifyButtonText}>
                                {isLoading ? 'Verifying...' : 'Verify OTP'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
            
            <CustomModal
                visible={modal.visible}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                onClose={() => setModal({ ...modal, visible: false })}
            />
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
});
