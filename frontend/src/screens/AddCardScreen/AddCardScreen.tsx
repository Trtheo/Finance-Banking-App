import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './AddCardScreen.styles';
import * as cardService from '../../services/cardService';

interface NavigationProps {
    navigate: (screen: string) => void;
    goBack: () => void;
}

interface AddCardScreenProps {
    navigation: NavigationProps;
}

export default function AddCardScreen({ navigation }: AddCardScreenProps) {
    const [cardType, setCardType] = useState('DEBIT');
    const [cardTier, setCardTier] = useState('PLATINUM');
    const [cardholderName, setCardholderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showCardTypes, setShowCardTypes] = useState(false);
    const [showCardTiers, setShowCardTiers] = useState(false);

    const cardTypes = ['DEBIT', 'CREDIT', 'PREPAID'];
    const cardTiers = ['PLATINUM'];

    const generateCardNumber = useCallback(() => {
        const prefix = '4532';
        let number = prefix;
        for (let i = 4; i < 16; i++) {
            number += Math.floor(Math.random() * 10);
        }
        return number.replace(/(\d{4})(?=\d)/g, '$1 ');
    }, []);

    const generateExpiryDate = useCallback(() => {
        const now = new Date();
        const futureDate = new Date(now.getFullYear() + 3, now.getMonth());
        const month = String(futureDate.getMonth() + 1).padStart(2, '0');
        const year = String(futureDate.getFullYear()).slice(-2);
        return `${month}/${year}`;
    }, []);

    useEffect(() => {
        setCardNumber(generateCardNumber());
        setExpiryDate(generateExpiryDate());
    }, [cardType, generateCardNumber, generateExpiryDate]);

    const handleAddCard = async () => {
        if (!cardholderName || !cvv) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (cvv.length !== 6) {
            Alert.alert('Error', 'Please enter a valid 6-digit CVV');
            return;
        }

        setIsLoading(true);
        try {
            await cardService.createCard(cardholderName);

            Alert.alert('Success', 'Card added successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            console.error('Card creation error:', error);
            Alert.alert('Error', 'Failed to save card');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add New Card</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView 
                    style={styles.content} 
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                <LinearGradient colors={['#2C2C2C', '#1A1A1A']} style={styles.card}>
                    <View style={styles.cardTop}>
                        <Text style={styles.cardBrand}>Nexpay</Text>
                        <View style={styles.chipIcon} />
                    </View>
                    <Text style={styles.cardNumber}>{cardNumber || '•••• •••• •••• 0000'}</Text>
                    <Text style={styles.cardBalance}>$0.00</Text>
                    <View style={styles.cardBottom}>
                        <View>
                            <Text style={styles.cardLabel}>Card holder name</Text>
                            <Text style={styles.cardInfo}>{cardholderName || 'Name'}</Text>
                        </View>
                        <View>
                            <Text style={styles.cardLabel}>Expiry date</Text>
                            <Text style={styles.cardInfo}>{expiryDate || 'MM/YY'}</Text>
                        </View>
                    </View>
                </LinearGradient>

                <Text style={styles.label}>Card Type</Text>
                <TouchableOpacity 
                    style={styles.input} 
                    onPress={() => setShowCardTypes(!showCardTypes)}
                >
                    <Ionicons name="card-outline" size={20} color="#999" />
                    <Text style={[styles.inputPlaceholder, cardType && { color: '#000' }]}>
                        {cardType || 'Select your card type'}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#999" />
                </TouchableOpacity>
                
                {showCardTypes && (
                    <View style={styles.dropdown}>
                        {cardTypes.map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setCardType(type);
                                    setShowCardTypes(false);
                                }}
                            >
                                <Text style={styles.dropdownText}>{type}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <Text style={styles.label}>Card Tier</Text>
                <TouchableOpacity 
                    style={styles.input} 
                    onPress={() => setShowCardTiers(!showCardTiers)}
                >
                    <Ionicons name="diamond-outline" size={20} color="#999" />
                    <Text style={[styles.inputPlaceholder, cardTier && { color: '#000' }]}>
                        {cardTier || 'Select card tier'}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#999" />
                </TouchableOpacity>
                
                {showCardTiers && (
                    <View style={styles.dropdown}>
                        {cardTiers.map((tier) => (
                            <TouchableOpacity
                                key={tier}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setCardTier(tier);
                                    setShowCardTiers(false);
                                }}
                            >
                                <Text style={styles.dropdownText}>{tier}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <Text style={styles.label}>Cardholder Name</Text>
                <View style={styles.input}>
                    <Ionicons name="person-outline" size={20} color="#999" />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your cardholder name"
                        placeholderTextColor="#999"
                        value={cardholderName}
                        onChangeText={setCardholderName}
                    />
                </View>

                <Text style={styles.label}>Card Number (Auto-generated)</Text>
                <View style={[styles.input, { backgroundColor: '#F8F8F8' }]}>
                    <Ionicons name="card-outline" size={20} color="#999" />
                    <Text style={[styles.textInput, { color: '#666' }]}>{cardNumber}</Text>
                    <TouchableOpacity onPress={() => setCardNumber(generateCardNumber())}>
                        <Ionicons name="refresh" size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Expiry Date (Auto-generated)</Text>
                <View style={[styles.input, { backgroundColor: '#F8F8F8' }]}>
                    <Ionicons name="calendar-outline" size={20} color="#999" />
                    <Text style={[styles.textInput, { color: '#666' }]}>{expiryDate}</Text>
                    <TouchableOpacity onPress={() => setExpiryDate(generateExpiryDate())}>
                        <Ionicons name="refresh" size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>CVV</Text>
                <View style={styles.input}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="6 digits"
                        placeholderTextColor="#999"
                        value={cvv}
                        onChangeText={setCvv}
                        keyboardType="numeric"
                        maxLength={6}
                        secureTextEntry
                    />
                    <Ionicons name="help-circle-outline" size={20} color="#999" />
                </View>

                <TouchableOpacity 
                    style={[styles.addButton, isLoading && styles.disabledButton]} 
                    onPress={handleAddCard}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.addButtonText}>Add Card</Text>
                    )}
                </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
