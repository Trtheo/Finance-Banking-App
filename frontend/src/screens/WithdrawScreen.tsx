import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WithdrawScreen({ navigation }: any) {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleWithdraw = async () => {
        const numAmount = parseFloat(amount);
        if (!amount || isNaN(numAmount) || numAmount <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        try {
            setIsLoading(true);
            
            const storedBalance = await AsyncStorage.getItem('userBalance');
            const currentBalance = storedBalance ? parseFloat(storedBalance) : 1000.00;
            
            if (currentBalance < numAmount) {
                Alert.alert('Insufficient Balance', 'You do not have enough balance for this withdrawal.');
                return;
            }
            
            const newBalance = currentBalance - numAmount;
            await AsyncStorage.setItem('userBalance', newBalance.toString());
            
            const transaction = {
                id: Date.now().toString(),
                type: 'Withdrawal',
                amount: numAmount,
                description: description || 'Withdrawal',
                date: new Date().toISOString(),
                status: 'Completed'
            };
            
            const existingTransactions = await AsyncStorage.getItem('internetPayments');
            const transactions = existingTransactions ? JSON.parse(existingTransactions) : [];
            transactions.unshift(transaction);
            await AsyncStorage.setItem('internetPayments', JSON.stringify(transactions));
            
            const notification = {
                id: Date.now().toString(),
                title: 'Withdrawal Successful',
                message: `$${numAmount.toFixed(2)} has been withdrawn from your account`,
                date: new Date().toISOString(),
                read: false,
                type: 'withdrawal',
                amount: numAmount
            };
            
            const existingNotifications = await AsyncStorage.getItem('notifications');
            const notifications = existingNotifications ? JSON.parse(existingNotifications) : [];
            notifications.unshift(notification);
            await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
            
            Alert.alert('Success', `Withdrawal of $${numAmount.toFixed(2)} completed successfully! New balance: $${newBalance.toFixed(2)}`, [
                { text: 'OK', onPress: () => navigation.navigate('Main') }
            ]);
        } catch (error: any) {
            Alert.alert('Error', 'Withdrawal failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Withdraw Money</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Withdraw from Your Account</Text>
                    
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Amount</Text>
                        <TextInput
                            style={styles.input}
                            value={amount}
                            onChangeText={setAmount}
                            placeholder="Enter amount"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Description (Optional)</Text>
                        <TextInput
                            style={styles.input}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Enter description"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.withdrawButton, isLoading && styles.disabledButton]}
                        onPress={handleWithdraw}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.buttonText}>Withdraw Now</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 25,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 25,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#FFF',
    },
    withdrawButton: {
        backgroundColor: '#FF5252',
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    disabledButton: {
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
    },
});
