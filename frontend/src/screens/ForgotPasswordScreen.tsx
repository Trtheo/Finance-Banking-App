import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen({ navigation }: any) {
    const [method, setMethod] = useState<'email' | 'phone'>('email');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSendCode = () => {
        const value = method === 'email' ? email : phone;
        console.log(`Sending code via ${method}:`, value);
        // TODO: Implement API call
        navigation.navigate('ResetPassword', { method, value });
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>

            <View style={styles.content}>
                <Text style={styles.title}>Forgot Password</Text>

                <View style={styles.card}>
                    <Text style={styles.heading}>
                        {method === 'email' ? 'Enter Your Email' : 'Enter Your Phone Number'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {method === 'email' 
                            ? 'Enter your email so we can send the code'
                            : 'Enter your phone number so we can send the code'}
                    </Text>

                    <Text style={styles.label}>
                        {method === 'email' ? 'Email' : 'Phone'}
                    </Text>

                    {method === 'email' ? (
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="michaeljohn@gmail.com"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    ) : (
                        <View style={styles.inputContainer}>
                            <View style={styles.flagContainer}>
                                <Text style={styles.flagText}>🇷🇼 +250</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="788 123 456"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                        </View>
                    )}

                    <TouchableOpacity style={styles.sendButton} onPress={handleSendCode}>
                        <Text style={styles.sendButtonText}>Send Code</Text>
                    </TouchableOpacity>

                    <View style={styles.switchContainer}>
                        <Text style={styles.switchText}>Want to choose another way? </Text>
                        <TouchableOpacity onPress={() => setMethod(method === 'email' ? 'phone' : 'email')}>
                            <Text style={styles.switchLink}>
                                {method === 'email' ? 'Use Phone Number' : 'Use Email'}
                            </Text>
                        </TouchableOpacity>
                    </View>
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
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
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
        marginBottom: 25,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    icon: {
        marginRight: 10,
    },
    flagContainer: {
        borderRightWidth: 1,
        borderRightColor: '#EEE',
        paddingRight: 10,
        marginRight: 10,
    },
    flagText: {
        fontSize: 16,
    },
    sendButton: {
        backgroundColor: '#FFD700',
        borderRadius: 25,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    sendButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    switchText: {
        fontSize: 14,
        color: '#888',
    },
    switchLink: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
    },
});
