import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function InternetPaymentSummaryScreen({ navigation, route }: any) {
    const { provider, customerId } = route.params;
    const [isProcessing, setIsProcessing] = useState(false);
    const [billAmount, setBillAmount] = useState('75.00');
    const adminFee = 1.00;
    const totalAmount = parseFloat(billAmount) + adminFee;

    const handlePayNow = async () => {
        try {
            setIsProcessing(true);
            
            // Get current balance from AsyncStorage (local storage)
            const storedBalance = await AsyncStorage.getItem('userBalance');
            const currentBalance = storedBalance ? parseFloat(storedBalance) : 1000.00; // Default balance
            
            if (currentBalance < totalAmount) {
                Alert.alert('Insufficient Balance', 'You do not have enough balance to complete this payment.');
                return;
            }
            
            // Deduct payment from local balance
            const newBalance = currentBalance - totalAmount;
            await AsyncStorage.setItem('userBalance', newBalance.toString());
            
            // Store transaction in AsyncStorage
            const transaction = {
                id: Date.now().toString(),
                type: 'Internet Payment',
                provider: provider.name,
                amount: totalAmount,
                date: new Date().toISOString(),
                status: 'Completed'
            };
            
            const existingTransactions = await AsyncStorage.getItem('internetPayments');
            const transactions = existingTransactions ? JSON.parse(existingTransactions) : [];
            transactions.unshift(transaction);
            await AsyncStorage.setItem('internetPayments', JSON.stringify(transactions));
            
            // Create notification
            const notification = {
                id: (Date.now() + 1).toString(),
                title: 'Payment Successful',
                message: `$${totalAmount.toFixed(2)} paid to ${provider.name}`,
                date: new Date().toISOString(),
                read: false,
                type: 'internet payment',
                amount: totalAmount
            };
            
            const existingNotifications = await AsyncStorage.getItem('notifications');
            const notifications = existingNotifications ? JSON.parse(existingNotifications) : [];
            notifications.unshift(notification);
            await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
            
            Alert.alert(
                'Payment Successful',
                `Your payment of $${totalAmount.toFixed(2)} to ${provider.name} has been processed successfully. New balance: $${newBalance.toFixed(2)}`,
                [{ text: 'OK', onPress: () => navigation.navigate('Main') }]
            );
            
        } catch (error: any) {
            Alert.alert('Payment Failed', 'Unable to process payment. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Internet</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.accountCard}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>JK</Text>
                        </View>
                        <View style={styles.accountInfo}>
                            <Text style={styles.accountName}>John Kennedy</Text>
                            <Text style={styles.accountDetails}>{provider.name} • {customerId}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Summary</Text>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Status</Text>
                        <View style={styles.unpaidBadge}>
                            <Text style={styles.unpaidText}>Unpaid</Text>
                        </View>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Bill</Text>
                        <TextInput
                            style={styles.amountInput}
                            value={billAmount}
                            onChangeText={setBillAmount}
                            keyboardType="numeric"
                            placeholder="0.00"
                        />
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Admin fee</Text>
                        <Text style={styles.summaryValue}>${adminFee.toFixed(2)}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.payNowButton, isProcessing && styles.disabledButton]}
                    onPress={handlePayNow}
                    disabled={isProcessing}
                >
                    <Text style={styles.payNowText}>
                        {isProcessing ? 'Processing...' : 'Pay Now'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: { fontSize: 18, fontWeight: '600' },
    scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
    section: { marginBottom: 30 },
    sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 15, color: '#333' },
    accountCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        padding: 15,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#EEE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarText: { fontSize: 16, fontWeight: '700', color: '#666' },
    accountInfo: { flex: 1 },
    accountName: { fontSize: 16, fontWeight: '600', color: '#333' },
    accountDetails: { fontSize: 14, color: '#999', marginTop: 2 },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    summaryLabel: { fontSize: 14, color: '#999' },
    summaryValue: { fontSize: 14, fontWeight: '600', color: '#333' },
    unpaidBadge: {
        backgroundColor: '#FFF0F0',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFDADA',
    },
    unpaidText: { fontSize: 12, fontWeight: '600', color: '#FF5252' },
    divider: { height: 1, backgroundColor: '#F5F5F5', marginVertical: 10 },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    totalLabel: { fontSize: 14, color: '#999' },
    totalValue: { fontSize: 24, fontWeight: '700', color: '#333' },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
    },
    payNowButton: {
        backgroundColor: '#FFDB15',
        borderRadius: 30,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },
    payNowText: { fontSize: 16, fontWeight: '700', color: '#000' },
    disabledButton: { opacity: 0.6 },
    amountInput: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'right',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingVertical: 4,
        minWidth: 80,
    },
});
