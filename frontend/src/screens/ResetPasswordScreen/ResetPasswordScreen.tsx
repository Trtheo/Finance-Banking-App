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
export default function ResetPasswordScreen({ navigation, route }) {
    const { userId, otp } = route.params;
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ password: false, confirmPassword: false });
    const [modal, setModal] = useState({ visible: false, type: 'error' as 'success' | 'error', title: '', message: '', onClose: () => {} });

    const handleResetPassword = async () => {
        const newErrors = {
            password: !password.trim(),
            confirmPassword: !confirmPassword.trim() || password !== confirmPassword,
        };
        
        setErrors(newErrors);
        
        if (Object.values(newErrors).some(error => error)) return;

        try {
            setIsLoading(true);
            await api.post('/auth/reset-password', { userId, otp, newPassword: password });
            
            setModal({ 
                visible: true, 
                type: 'success', 
                title: 'Success', 
                message: 'Password reset successfully!',
                onClose: () => navigation.navigate('Login')
            });
        } catch (error: any) {
            setModal({ 
                visible: true, 
                type: 'error', 
                title: 'Error', 
                message: error.response?.data?.message || 'Failed to reset password',
                onClose: () => setModal({ ...modal, visible: false })
            });
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
                    <View style={styles.header}>
                        <Text style={styles.logoText}>Nexpay</Text>
                        <Text style={styles.title}>Reset Password</Text>
                        <Text style={styles.subtitle}>Enter your new password</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={[styles.label, errors.password && styles.labelError]}>New Password</Text>
                        <View style={[styles.inputContainer, errors.password && styles.inputError]}>
                            <Ionicons name="key-outline" size={20} color={errors.password ? "#FF0000" : "#666"} style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••••"
                                placeholderTextColor={errors.password ? "#FF9999" : "#999"}
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    if (errors.password) setErrors({...errors, password: false});
                                }}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color={errors.password ? "#FF0000" : "#666"}
                                />
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.label, errors.confirmPassword && styles.labelError]}>Confirm Password</Text>
                        <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
                            <Ionicons name="key-outline" size={20} color={errors.confirmPassword ? "#FF0000" : "#666"} style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••••"
                                placeholderTextColor={errors.confirmPassword ? "#FF9999" : "#999"}
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    if (errors.confirmPassword) setErrors({...errors, confirmPassword: false});
                                }}
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <Ionicons
                                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color={errors.confirmPassword ? "#FF0000" : "#666"}
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.resetButton, isLoading && { opacity: 0.7 }]}
                            onPress={handleResetPassword}
                            disabled={isLoading}
                        >
                            <Text style={styles.resetButtonText}>
                                {isLoading ? 'Resetting...' : 'Reset Password'}
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
                onClose={modal.onClose}
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
        justifyContent: 'center',
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
    resetButton: {
        backgroundColor: '#FFD700',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 30,
    },
    resetButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
