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

// @ts-ignore
export default function LoginScreen({ navigation }) {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        console.log('Logging in with:', { identifier, password });
        // TODO: Validate credentials
        navigation.replace('Dashboard');
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
                        <Text style={styles.title}>Welcome Back!</Text>
                        <Text style={styles.subtitle}>Log in to access your accounts</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.label}>Email or Phone</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter email or phone"
                                value={identifier}
                                onChangeText={setIdentifier}
                                autoCapitalize="none"
                            />
                        </View>

                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="key-outline" size={20} color="#666" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••••"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                            <Text style={styles.loginButtonText}>Login</Text>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
                                <Text style={styles.registerText}>Register</Text>
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
        fontSize: 16,
        color: '#333',
    },
    icon: {
        marginRight: 5,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: 10,
    },
    forgotPasswordText: {
        color: '#666',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#FFD700',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 30,
    },
    loginButtonText: {
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
    registerText: {
        color: '#333',
        fontWeight: 'bold',
    },
});
