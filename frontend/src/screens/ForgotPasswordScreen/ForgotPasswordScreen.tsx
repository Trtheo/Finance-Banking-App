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
export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [modal, setModal] = useState({ visible: false, type: 'error' as 'success' | 'error', title: '', message: '' });

    const handleSendOTP = async () => {
        setEmailError(false);
        
        if (!email.trim()) {
            setEmailError(true);
            return;
        }

        try {
            setIsLoading(true);
            const response = await api.post('/auth/forgot-password', { email });
            
            setModal({ 
                visible: true, 
                type: 'success', 
                title: 'OTP Sent', 
                message: 'Please check your email for the verification code.',
            });
            
            setTimeout(() => {
                navigation.navigate('ResetPasswordOTP', {
                    email,
                    userId: response.data.userId
                });
            }, 1500);
        } catch (error: any) {
            console.log('Forgot password error:', error.response?.data || error.message);
            const message = error.response?.data?.message || error.message || 'Failed to send OTP. Please try again.';
            setModal({ visible: true, type: 'error', title: 'Error', message });
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
                        <Text style={styles.title}>Forgot Password?</Text>
                        <Text style={styles.subtitle}>
                            Enter your email and we'll send you an OTP to reset your password
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={[styles.label, emailError && styles.labelError]}>Email</Text>
                        <View style={[styles.inputContainer, emailError && styles.inputError]}>
                            <Ionicons name="mail-outline" size={20} color={emailError ? "#FF0000" : "#666"} style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor={emailError ? "#FF9999" : "#999"}
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    if (emailError) setEmailError(false);
                                }}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoFocus
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.sendButton, isLoading && { opacity: 0.7 }]}
                            onPress={handleSendOTP}
                            disabled={isLoading}
                        >
                            <Text style={styles.sendButtonText}>
                                {isLoading ? 'Sending...' : 'Send OTP'}
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
    labelError: {
        color: '#FF0000',
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
    inputError: {
        borderColor: '#FF0000',
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    icon: {
        marginRight: 5,
    },
    sendButton: {
        backgroundColor: '#FFD700',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 30,
    },
    sendButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
