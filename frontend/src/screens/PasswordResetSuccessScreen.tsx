import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function PasswordResetSuccessScreen({ navigation }: any) {
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
                <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>

            <Text style={styles.title}>Forgot Password</Text>

            <View style={styles.content}>
                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="checkmark" size={50} color="#FFD700" />
                        </View>
                    </View>

                    <Text style={styles.heading}>Congratulation!</Text>
                    <Text style={styles.subtitle}>Your password successfully updated!</Text>

                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.buttonText}>Back to Login</Text>
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
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 30,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    iconContainer: {
        marginBottom: 30,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#2C2C2C',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 40,
        textAlign: 'center',
    },
    button: {
        width: '100%',
        backgroundColor: '#FFD700',
        borderRadius: 25,
        paddingVertical: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
