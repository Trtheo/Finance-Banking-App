import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function AddCardScreen({ navigation }: any) {
    const [cardType, setCardType] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add New Card</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <LinearGradient colors={['#2C2C2C', '#1A1A1A']} style={styles.card}>
                    <View style={styles.cardTop}>
                        <Text style={styles.cardBrand}>Nexpay</Text>
                        <View style={styles.chipIcon} />
                    </View>
                    <Text style={styles.cardNumber}>•••• •••• •••• 0000</Text>
                    <Text style={styles.cardBalance}>$0.00</Text>
                    <View style={styles.cardBottom}>
                        <View>
                            <Text style={styles.cardLabel}>Card holder name</Text>
                            <Text style={styles.cardInfo}>Name</Text>
                        </View>
                        <View>
                            <Text style={styles.cardLabel}>Expiry date</Text>
                            <Text style={styles.cardInfo}>MM/DD</Text>
                        </View>
                    </View>
                </LinearGradient>

                <Text style={styles.label}>Card Type</Text>
                <TouchableOpacity style={styles.input}>
                    <Ionicons name="card-outline" size={20} color="#999" />
                    <Text style={styles.inputPlaceholder}>Select your card type</Text>
                    <Ionicons name="chevron-down" size={20} color="#999" />
                </TouchableOpacity>

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

                <Text style={styles.label}>Card Number</Text>
                <View style={styles.input}>
                    <Ionicons name="card-outline" size={20} color="#999" />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your card number"
                        placeholderTextColor="#999"
                        value={cardNumber}
                        onChangeText={setCardNumber}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <Text style={styles.label}>Expiry Date</Text>
                        <View style={styles.input}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="MM/YY"
                                placeholderTextColor="#999"
                                value={expiryDate}
                                onChangeText={setExpiryDate}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.label}>CVV</Text>
                        <View style={styles.input}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="3 digits"
                                placeholderTextColor="#999"
                                value={cvv}
                                onChangeText={setCvv}
                                keyboardType="numeric"
                                maxLength={3}
                            />
                            <Ionicons name="help-circle-outline" size={20} color="#999" />
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add Card</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    card: {
        borderRadius: 16,
        padding: 20,
        height: 200,
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardBrand: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFF',
    },
    chipIcon: {
        width: 40,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 6,
    },
    cardNumber: {
        fontSize: 18,
        color: '#FFF',
        letterSpacing: 2,
        marginTop: 10,
    },
    cardBalance: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 5,
    },
    cardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    cardLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 4,
    },
    cardInfo: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFF',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000',
        marginBottom: 8,
        marginTop: 15,
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 15,
        gap: 10,
    },
    inputPlaceholder: {
        flex: 1,
        fontSize: 14,
        color: '#999',
    },
    textInput: {
        flex: 1,
        fontSize: 14,
        color: '#000',
    },
    row: {
        flexDirection: 'row',
    },
    addButton: {
        backgroundColor: '#E0E0E0',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 30,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
});
