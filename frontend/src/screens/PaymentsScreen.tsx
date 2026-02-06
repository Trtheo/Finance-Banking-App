import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { PayBillsMenu } from '../components/PayBillsMenu';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentsScreen() {
    const [menuVisible, setMenuVisible] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            setMenuVisible(true);
        }
    }, [isFocused]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Pay Bills</Text>
                <Text style={styles.subtitle}>Select a service to pay</Text>
                
                <TouchableOpacity 
                    style={styles.openButton}
                    onPress={() => setMenuVisible(true)}
                >
                    <Ionicons name="receipt-outline" size={24} color="#FFF" />
                    <Text style={styles.openButtonText}>Open Bill Menu</Text>
                </TouchableOpacity>
            </ScrollView>
            <PayBillsMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        marginBottom: 30,
    },
    openButton: {
        backgroundColor: '#1A237E',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 10,
    },
    openButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
