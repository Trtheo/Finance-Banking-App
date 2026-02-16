import React, { useCallback, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import * as transactionService from '../../services/transactionService';
import * as cardService from '../../services/cardService';

export default function DepositScreen({ navigation }: any) {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCardId, setSelectedCardId] = useState('');
    const [cards, setCards] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCards, setIsLoadingCards] = useState(true);

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

    const handleDeposit = async () => {
        const numAmount = parseFloat(amount);
        if (!amount || isNaN(numAmount) || numAmount <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        if (cards.length === 0) {
            Alert.alert('No Card', 'You need at least one card before making a deposit.');
            return;
        }

        if (!selectedCardId) {
            Alert.alert('Select Card', 'Please select a card to deposit to.');
            return;
        }

        setIsLoading(true);
        try {
            await transactionService.deposit(numAmount, description.trim() || undefined, selectedCardId);
            Alert.alert('Success', `Successfully deposited RWF ${numAmount.toLocaleString()}`, [
                { text: 'OK', onPress: () => navigation.navigate('Main') },
            ]);
        } catch (error: any) {
            Alert.alert('Deposit Failed', error.response?.data?.message || error.message || 'Failed to process deposit');
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
                <Text style={styles.title}>Deposit Money</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Add Funds to Your Account</Text>

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

                    {isLoadingCards ? (
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Deposit To</Text>
                            <ActivityIndicator size="small" color="#FFDE31" />
                        </View>
                    ) : cards.length > 1 ? (
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Deposit To Card</Text>
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
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Deposit To Card</Text>
                            <View style={styles.readOnlyCardBox}>
                                <Text style={styles.readOnlyCardText}>{cardLabel(cards[0])}</Text>
                            </View>
                        </View>
                    ) : null}

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
                        style={[styles.depositButton, isLoading && styles.disabledButton]}
                        onPress={handleDeposit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text style={styles.buttonText}>Deposit Now</Text>
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
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        backgroundColor: '#FFF',
    },
    readOnlyCardBox: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 14,
        backgroundColor: '#F8F8F8',
    },
    readOnlyCardText: {
        fontSize: 16,
        color: '#333',
    },
    depositButton: {
        backgroundColor: '#FFDE31',
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
        color: '#000',
    },
});
