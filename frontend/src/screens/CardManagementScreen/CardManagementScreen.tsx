import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as cardService from '../../services/cardService';
import * as walletService from '../../services/walletService';

export default function CardManagementScreen({ navigation }: any) {
    const [cards, setCards] = useState<any[]>([]);
    const [walletBalance, setWalletBalance] = useState<number | null>(null);
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const normalizeCard = (card: any) => ({
        ...card,
        cardType: (card.cardType || 'debit').toUpperCase(),
        cardTier: (card.cardTier || 'PLATINUM').toUpperCase(),
        cardholderName: card.cardholderName || card.cardHolderName || 'Nexpay User',
        isActive: card.status !== 'blocked',
    });

    const fetchCards = useCallback(async () => {
        try {
            setIsLoading(true);
            const [walletResult, cardsResult] = await Promise.allSettled([
                walletService.getWalletMe(),
                cardService.getCards(),
            ]);

            if (walletResult.status === 'fulfilled') {
                setWalletBalance(Number(walletResult.value?.balance || 0));
            } else {
                setWalletBalance(null);
            }

            if (cardsResult.status !== 'fulfilled') {
                throw cardsResult.reason;
            }

            setCards((Array.isArray(cardsResult.value) ? cardsResult.value : []).map(normalizeCard));
        } catch (error: any) {
            console.log('Error fetching cards:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to load cards');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchCards();
        }, [fetchCards])
    );

    const resolveCardBalance = (card: any) => {
        if (cards.length === 1 && walletBalance !== null) return Number(walletBalance || 0);
        return Number(card.balance || 0);
    };

    const formatVisibleBalance = (amount: number) => {
        if (!isBalanceVisible) return 'RWF ••••••';
        return `RWF ${Number(amount || 0).toLocaleString()}`;
    };

    const handleCardPress = (card: any) => {
        const effectiveBalance = resolveCardBalance(card);
        navigation.navigate('CardDetails', {
            card: { ...card, balance: effectiveBalance },
            walletBalance: walletBalance ?? effectiveBalance,
            cardsCount: cards.length,
        });
    };

    const handleAddCard = () => {
        navigation.navigate('AddCard');
    };

    const toggleCardStatus = async (card: any) => {
        try {
            if (card.status === 'blocked') {
                await cardService.unfreezeCard(card._id);
            } else {
                await cardService.freezeCard(card._id);
            }
            await fetchCards();
            Alert.alert('Success', `Card ${card.status === 'blocked' ? 'unfrozen' : 'frozen'} successfully`);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to update card status');
        }
    };

    const deleteCardById = async (cardId: string) => {
        try {
            await cardService.deleteCard(cardId);
            await fetchCards();
            Alert.alert('Success', 'Card deleted successfully');
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to delete card');
        }
    };

    const handleCardAction = async (card: any, action: string) => {
        switch (action) {
            case 'freeze':
                Alert.alert(
                    card.isActive ? 'Freeze Card' : 'Unfreeze Card',
                    card.isActive ? 'Are you sure you want to freeze this card?' : 'Are you sure you want to unfreeze this card?',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: card.isActive ? 'Freeze' : 'Unfreeze', onPress: () => toggleCardStatus(card) }
                    ]
                );
                break;
            case 'delete':
                Alert.alert('Delete Card', 'Are you sure you want to delete this card?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => deleteCardById(card._id) }
                ]);
                break;
        }
    };

    const getCardColors = (cardType: string): [string, string, ...string[]] => {
        switch (cardType?.toUpperCase()) {
            case 'CREDIT':
                return ['#D4AF37', '#B8941F', '#8B7355'];
            case 'PREPAID':
                return ['#4A90E2', '#357ABD'];
            default:
                return ['#2C2C2C', '#1A1A1A'];
        }
    };

    const formatExpiry = (expiryDate: string) => {
        const parsed = new Date(expiryDate);
        if (Number.isNaN(parsed.getTime())) return expiryDate || '--/--';
        return parsed.toLocaleDateString(undefined, { month: '2-digit', year: '2-digit' });
    };

    const formatCardNumber = (cardNumber: string) => {
        const digitsOnly = String(cardNumber || '').replace(/\D/g, '');
        if (!digitsOnly) return '0000 0000 0000 0000';
        return digitsOnly.replace(/(.{4})/g, '$1 ').trim();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Card Management</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => setIsBalanceVisible(prev => !prev)}>
                        <Ionicons name={isBalanceVisible ? 'eye-off-outline' : 'eye-outline'} size={20} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn} onPress={handleAddCard}>
                        <Ionicons name="add" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FFDE31" />
                        <Text style={styles.loadingText}>Loading cards...</Text>
                    </View>
                ) : cards.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="card-outline" size={64} color="#CCC" />
                        <Text style={styles.emptyText}>No cards found</Text>
                        <Text style={styles.emptySubtext}>Add your first card to get started</Text>
                    </View>
                ) : (
                    cards.map((card: any) => (
                        <View key={card._id} style={styles.cardSection}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardLabel}>{card.cardTier} {card.cardType} Card</Text>
                                <View style={styles.cardActions}>
                                    <TouchableOpacity
                                        style={[styles.actionPill, card.isActive ? styles.freezePill : styles.unfreezePill]}
                                        onPress={() => handleCardAction(card, 'freeze')}
                                    >
                                        <Ionicons
                                            name={card.isActive ? 'pause' : 'play'}
                                            size={14}
                                            color="#FFF"
                                        />
                                        <Text style={styles.actionPillText}>{card.isActive ? 'Freeze' : 'Unfreeze'}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.actionPill, styles.deletePill]}
                                        onPress={() => handleCardAction(card, 'delete')}
                                    >
                                        <Ionicons name="trash-outline" size={14} color="#FFF" />
                                        <Text style={styles.actionPillText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity onPress={() => handleCardPress(card)}>
                                <LinearGradient
                                    colors={getCardColors(card.cardType)}
                                    style={[styles.card, !card.isActive && styles.frozenCard]}
                                >
                                    {!card.isActive && (
                                        <View style={styles.frozenOverlay}>
                                            <Ionicons name="pause" size={24} color="#FFF" />
                                            <Text style={styles.frozenText}>FROZEN</Text>
                                        </View>
                                    )}
                                    <View style={styles.cardTop}>
                                        <Text style={styles.cardBrand}>Nexpay</Text>
                                        <View style={styles.chipIcon} />
                                    </View>
                                    <Text style={styles.cardNumber}>
                                        {formatCardNumber(card.cardNumber)}
                                    </Text>
                                    <Text style={styles.cardBalance}>{formatVisibleBalance(resolveCardBalance(card))}</Text>
                                    <View style={styles.cardBottom}>
                                        <View>
                                            <Text style={styles.cardLabel2}>Card holder name</Text>
                                            <Text style={styles.cardInfo}>{card.cardholderName}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.cardLabel2}>Expiry date</Text>
                                            <Text style={styles.cardInfo}>{formatExpiry(card.expiryDate)}</Text>
                                        </View>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    ))
                )}

                <TouchableOpacity style={styles.addButton} onPress={handleAddCard}>
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
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
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
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionPill: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        borderRadius: 12,
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    freezePill: {
        backgroundColor: '#EF6C00',
    },
    unfreezePill: {
        backgroundColor: '#2E7D32',
    },
    deletePill: {
        backgroundColor: '#C62828',
    },
    actionPillText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
    },
    card: {
        borderRadius: 16,
        padding: 20,
        height: 200,
        justifyContent: 'space-between',
        position: 'relative',
    },
    frozenCard: {
        opacity: 0.7,
    },
    frozenOverlay: {
        position: 'absolute',
        top: 20,
        right: 20,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 8,
        padding: 8,
    },
    frozenText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 2,
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
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginLeft: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        textAlign: 'center',
    },
});
