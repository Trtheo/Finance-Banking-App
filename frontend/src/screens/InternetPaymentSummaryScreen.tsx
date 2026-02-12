import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import * as transactionService from '../services/transactionService';
import * as walletService from '../services/walletService';
import * as cardService from '../services/cardService';
import { getPaymentServiceByKey } from '../constants/paymentServices';

export default function InternetPaymentSummaryScreen({ navigation, route }: any) {
    const {
        provider,
        serviceKey = 'internet',
        serviceLabel = 'Internet',
        formValues: routeFormValues,
        customerId,
    } = route.params || {};

    const serviceConfig = useMemo(() => getPaymentServiceByKey(serviceKey), [serviceKey]);
    const formValues = useMemo(() => {
        if (routeFormValues && typeof routeFormValues === 'object') {
            return routeFormValues as Record<string, string>;
        }

        if (customerId) {
            return { customerId: String(customerId) };
        }

        return {};
    }, [routeFormValues, customerId]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [billAmount, setBillAmount] = useState('75000');
    const [cards, setCards] = useState<any[]>([]);
    const [selectedCardId, setSelectedCardId] = useState('');
    const [isLoadingCards, setIsLoadingCards] = useState(true);

    const adminFee = 1000;

    const totalAmount = useMemo(() => {
        const parsedBillAmount = Number(billAmount);
        if (!Number.isFinite(parsedBillAmount) || parsedBillAmount < 0) return adminFee;
        return parsedBillAmount + adminFee;
    }, [adminFee, billAmount]);

    const loadCards = useCallback(async () => {
        try {
            setIsLoadingCards(true);
            const apiCards = await cardService.getCards();
            const cardsList = Array.isArray(apiCards) ? apiCards : [];
            setCards(cardsList);

            if (cardsList.length > 0) {
                const defaultCard = cardsList.find((card: any) => card.isDefault) || cardsList[0];
                setSelectedCardId(defaultCard?._id || '');
            } else {
                setSelectedCardId('');
            }
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to load cards');
        } finally {
            setIsLoadingCards(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadCards();
        }, [loadCards])
    );

    const cardLabel = (card: any) => {
        const suffix = String(card.cardNumber || '').slice(-4) || '0000';
        const tier = (card.cardTier || 'PLATINUM').toUpperCase();
        return `${tier} ••••${suffix}`;
    };

    const detailSummary = useMemo(() => {
        return serviceConfig.fields
            .map((field) => {
                const value = formValues[field.key];
                if (!value) return null;
                return `${field.label}: ${value}`;
            })
            .filter(Boolean)
            .join(', ');
    }, [formValues, serviceConfig.fields]);

    const handlePayNow = async () => {
        try {
            const parsedBillAmount = Number(billAmount);
            if (!Number.isFinite(parsedBillAmount) || parsedBillAmount <= 0) {
                Alert.alert('Invalid Amount', 'Please enter a valid bill amount.');
                return;
            }

            if (cards.length === 0) {
                Alert.alert('No Card', 'You need at least one card before making a payment.');
                return;
            }

            if (!selectedCardId) {
                Alert.alert('Select Card', 'Please select the card to use for this payment.');
                return;
            }

            setIsProcessing(true);

            await transactionService.payBill(
                totalAmount,
                `${serviceLabel} payment to ${provider?.name || 'provider'}${detailSummary ? ` (${detailSummary})` : ''}`,
                selectedCardId
            );

            const latestWallet = await walletService.getWalletMe().catch(() => null);
            const balanceText = latestWallet
                ? `${latestWallet?.currency || 'RWF'} ${Number(latestWallet?.balance || 0).toLocaleString()}`
                : 'Updated';

            Alert.alert(
                'Payment Successful',
                `Your ${serviceLabel.toLowerCase()} payment of RWF ${totalAmount.toLocaleString()} to ${provider?.name || 'provider'} has been processed successfully. New balance: ${balanceText}`,
                [{ text: 'OK', onPress: () => navigation.navigate('Main') }]
            );
        } catch (error: any) {
            Alert.alert('Payment Failed', error.response?.data?.message || 'Unable to process payment. Please try again.');
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
                <Text style={styles.headerTitle}>{serviceLabel}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.accountCard}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{String(provider?.name || 'IP').slice(0, 2).toUpperCase()}</Text>
                        </View>
                        <View style={styles.accountInfo}>
                            <Text style={styles.accountName}>{serviceLabel} Account</Text>
                            <Text style={styles.accountDetails}>
                                {provider?.name || 'Provider'}
                                {detailSummary ? ` • ${detailSummary}` : ''}
                            </Text>
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
                            placeholder="0"
                        />
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Admin fee</Text>
                        <Text style={styles.summaryValue}>RWF {adminFee.toLocaleString()}</Text>
                    </View>

                    {serviceConfig.fields.map((field) => (
                        <View key={field.key} style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>{field.label}</Text>
                            <Text style={styles.summaryValue}>{formValues[field.key] || '-'}</Text>
                        </View>
                    ))}

                    {isLoadingCards ? (
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Pay from card</Text>
                            <ActivityIndicator size="small" color="#FFDB15" />
                        </View>
                    ) : cards.length > 1 ? (
                        <View style={styles.summaryItemColumn}>
                            <Text style={styles.summaryLabel}>Pay from card</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={selectedCardId}
                                    onValueChange={(itemValue) => setSelectedCardId(itemValue)}
                                >
                                    {cards.map((card: any) => (
                                        <Picker.Item
                                            key={card._id}
                                            label={cardLabel(card)}
                                            value={card._id}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    ) : cards.length === 1 ? (
                        <View style={styles.summaryItemColumn}>
                            <Text style={styles.summaryLabel}>Pay from card</Text>
                            <View style={styles.readOnlyCardBox}>
                                <Text style={styles.readOnlyCardText}>{cardLabel(cards[0])}</Text>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Pay from card</Text>
                            <Text style={styles.summaryValue}>No card</Text>
                        </View>
                    )}

                    <View style={styles.divider} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>RWF {totalAmount.toLocaleString()}</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.payNowButton, isProcessing && styles.disabledButton]}
                    onPress={handlePayNow}
                    disabled={isProcessing || isLoadingCards}
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
    summaryItemColumn: {
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
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        backgroundColor: '#FFF',
        marginTop: 8,
    },
    readOnlyCardBox: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 14,
        backgroundColor: '#F8F8F8',
        marginTop: 8,
    },
    readOnlyCardText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
    },
});
