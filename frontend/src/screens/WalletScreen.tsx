import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as walletService from '../services/walletService';
import * as cardService from '../services/cardService';

export default function WalletScreen({ navigation }: any) {
    const [wallet, setWallet] = useState<any>(null);
    const [cards, setCards] = useState<any[]>([]);
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const fetchWalletAndCards = useCallback(async () => {
        setIsLoading(true);
        try {
            const [walletData, apiCards] = await Promise.all([
                walletService.getWalletMe(),
                cardService.getCards(),
            ]);

            setWallet(walletData);
            setCards(Array.isArray(apiCards) ? apiCards : []);
        } catch (error: any) {
            console.error('Error fetching cards data:', error.message);
            Alert.alert('Error', 'Failed to fetch cards data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchWalletAndCards();
        }, [fetchWalletAndCards])
    );

    const formatCardNumber = (cardNumber: string) => {
        const digitsOnly = String(cardNumber || '').replace(/\D/g, '');
        if (!digitsOnly) return '0000 0000 0000 0000';
        return digitsOnly.replace(/(.{4})/g, '$1 ').trim();
    };

    const getCardColors = (card: any): [string, string, ...string[]] => {
        const tier = String(card?.cardTier || '').toUpperCase();
        if (tier === 'GOLD') {
            return ['#D4AF37', '#B8941F', '#8B7355'];
        }
        return ['#2C2C2C', '#1A1A1A'];
    };

    const formatExpiry = (dateValue: string) => {
        if (!dateValue) return '--/--';
        const parsed = new Date(dateValue);
        if (Number.isNaN(parsed.getTime())) return dateValue;
        return parsed.toLocaleDateString(undefined, { month: '2-digit', year: '2-digit' });
    };

    const formatVisibleBalance = (amount: number, currency = 'RWF') => {
        if (!isBalanceVisible) return `${currency} ••••••`;
        return `${currency} ${Number(amount || 0).toLocaleString()}`;
    };

    const handleCardPress = (cardData: any) => {
        const singleCardBalance =
            cards.length === 1 ? Number(wallet?.balance || 0) : Number(cardData?.balance || 0);

        if (navigation && navigation.navigate) {
            navigation.navigate('CardDetails', {
                card: { ...cardData, balance: singleCardBalance },
                walletBalance: Number(wallet?.balance || 0),
                cardsCount: cards.length,
            });
        } else {
            Alert.alert('Navigation Error', 'Navigation object is not available');
        }
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
                <ActivityIndicator size="large" color="#FFD700" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Cards</Text>
                    <Text style={styles.totalText}>
                        Total Balance: {formatVisibleBalance(Number(wallet?.balance || 0), wallet?.currency || 'RWF')}
                    </Text>
                </View>
                <TouchableOpacity style={styles.iconBtn} onPress={() => setIsBalanceVisible(prev => !prev)}>
                    <Ionicons name={isBalanceVisible ? 'eye-off-outline' : 'eye-outline'} size={20} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {cards.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="card-outline" size={56} color="#AAA" />
                        <Text style={styles.emptyTitle}>No cards yet</Text>
                        <Text style={styles.emptySubTitle}>Your default Platinum card will appear after account setup.</Text>
                    </View>
                ) : (
                    cards.map((card: any) => {
                        const displayCardBalance =
                            cards.length === 1 ? Number(wallet?.balance || 0) : Number(card.balance || 0);

                        return (
                            <TouchableOpacity
                                key={card._id}
                                style={styles.cardSection}
                                onPress={() => handleCardPress(card)}
                            >
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardLabel}>
                                        {(card.cardTier || 'PLATINUM').toUpperCase()} {(card.cardType || 'DEBIT').toUpperCase()} Card
                                    </Text>
                                    <Ionicons name="arrow-forward" size={20} color="#000" />
                                </View>

                                <LinearGradient colors={getCardColors(card)} style={styles.card}>
                                    <View style={styles.cardTop}>
                                        <Text style={styles.cardBrand}>Nexpay</Text>
                                        <View style={styles.chipIcon} />
                                    </View>
                                    <Text style={styles.cardNumber}>{formatCardNumber(card.cardNumber)}</Text>
                                    <Text style={styles.cardBalance}>
                                        {formatVisibleBalance(displayCardBalance, wallet?.currency || 'RWF')}
                                    </Text>
                                    <View style={styles.cardBottom}>
                                        <View>
                                            <Text style={styles.cardLabel2}>Card holder name</Text>
                                            <Text style={styles.cardInfo}>{card.cardHolderName || 'Nexpay User'}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.cardLabel2}>Expiry date</Text>
                                            <Text style={styles.cardInfo}>{formatExpiry(card.expiryDate)}</Text>
                                        </View>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        );
                    })
                )}

                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddCard')}>
                    <Ionicons name="add" size={20} color="#000" />
                    <Text style={styles.addButtonText}>Add New Card</Text>
                </TouchableOpacity>
            </ScrollView>
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
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    totalText: {
        marginTop: 4,
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 48,
    },
    emptyTitle: {
        marginTop: 12,
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    emptySubTitle: {
        marginTop: 8,
        fontSize: 13,
        color: '#777',
        textAlign: 'center',
        maxWidth: 260,
    },
    cardSection: {
        marginBottom: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    card: {
        borderRadius: 16,
        padding: 20,
        height: 200,
        justifyContent: 'space-between',
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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 5,
    },
    cardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    cardLabel2: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 4,
    },
    cardInfo: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFF',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        marginBottom: 30,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginLeft: 8,
    },
});
