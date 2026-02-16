import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as cardService from '../../services/cardService';

const WITHDRAW_LIMIT_PER_CARD = 5_000_000;

export default function CardDetailsScreen({ navigation, route }: any) {
    const { card, walletBalance = 0, cardsCount = 0 } = route.params || {};
    const [cardStatus, setCardStatus] = useState(card?.status !== 'blocked');
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const effectiveBalance = useMemo(() => {
        return Number(cardsCount) === 1 ? Number(walletBalance || 0) : Number(card?.balance || 0);
    }, [cardsCount, walletBalance, card?.balance]);

    const getCardColors = (cardType: string): [string, string, ...string[]] => {
        switch (String(cardType || '').toUpperCase()) {
            case 'CREDIT':
                return ['#D4AF37', '#B8941F', '#8B7355'];
            case 'PREPAID':
                return ['#4A90E2', '#357ABD'];
            default:
                return ['#2C2C2C', '#1A1A1A'];
        }
    };

    const displayCardNumber = useMemo(() => {
        const digitsOnly = String(card?.cardNumber || '').replace(/\D/g, '');
        if (!digitsOnly) return '0000 0000 0000 0000';
        return digitsOnly.replace(/(.{4})/g, '$1 ').trim();
    }, [card?.cardNumber]);

    const displayExpiry = useMemo(() => {
        if (!card?.expiryDate) return '--/--';
        const parsed = new Date(card.expiryDate);
        if (Number.isNaN(parsed.getTime())) return String(card.expiryDate);
        return parsed.toLocaleDateString(undefined, { month: '2-digit', year: '2-digit' });
    }, [card?.expiryDate]);

    const cardholderName = card?.cardholderName || card?.cardHolderName || 'Nexpay User';

    const handleToggleFreeze = async () => {
        if (!card?._id) {
            Alert.alert('Unavailable', 'This card cannot be updated right now.');
            return;
        }

        try {
            setIsActionLoading(true);
            if (cardStatus) {
                await cardService.freezeCard(card._id);
                setCardStatus(false);
                Alert.alert('Card Frozen', 'Your card has been frozen successfully.');
            } else {
                await cardService.unfreezeCard(card._id);
                setCardStatus(true);
                Alert.alert('Card Unfrozen', 'Your card is now active.');
            }
        } catch (error: any) {
            Alert.alert('Action Failed', error.response?.data?.message || 'Failed to update card status.');
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDeleteCard = () => {
        if (!card?._id) {
            Alert.alert('Unavailable', 'This card cannot be deleted right now.');
            return;
        }

        Alert.alert('Delete Card', 'Are you sure you want to delete this card?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        setIsActionLoading(true);
                        await cardService.deleteCard(card._id);
                        Alert.alert('Card Deleted', 'Card deleted successfully.', [
                            { text: 'OK', onPress: () => navigation.goBack() },
                        ]);
                    } catch (error: any) {
                        Alert.alert('Delete Failed', error.response?.data?.message || 'Failed to delete card.');
                    } finally {
                        setIsActionLoading(false);
                    }
                },
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Card Details</Text>
                <TouchableOpacity onPress={() => setIsBalanceVisible(prev => !prev)}>
                    <Ionicons name={isBalanceVisible ? 'eye-off-outline' : 'eye-outline'} size={22} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <LinearGradient colors={getCardColors(card?.cardType)} style={styles.card}>
                    <View style={styles.cardTop}>
                        <Text style={styles.cardBrand}>Nexpay</Text>
                        <View style={styles.chipIcon} />
                    </View>

                    <Text style={styles.cardNumber}>{displayCardNumber}</Text>

                    <Text style={styles.cardBalance}>
                        {isBalanceVisible ? `RWF ${effectiveBalance.toLocaleString()}` : 'RWF ••••••'}
                    </Text>

                    <View style={styles.cardBottom}>
                        <View>
                            <Text style={styles.cardLabel}>Card holder name</Text>
                            <Text style={styles.cardInfo}>{cardholderName}</Text>
                        </View>
                        <View>
                            <Text style={styles.cardLabel}>Expiry date</Text>
                            <Text style={styles.cardInfo}>{displayExpiry}</Text>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Card Information</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Card Number</Text>
                        <Text style={styles.infoValue}>{displayCardNumber}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Expiry Date</Text>
                        <Text style={styles.infoValue}>{displayExpiry}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Card Holder</Text>
                        <Text style={styles.infoValue}>{cardholderName}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Card Status</Text>
                        <Text style={[styles.infoValue, cardStatus ? styles.statusActive : styles.statusFrozen]}>
                            {cardStatus ? 'ACTIVE' : 'FROZEN'}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Withdraw Limit</Text>
                        <Text style={styles.infoValue}>RWF {WITHDRAW_LIMIT_PER_CARD.toLocaleString()}</Text>
                    </View>
                </View>

                <View style={styles.actionsSection}>
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            cardStatus ? styles.freezeButton : styles.unfreezeButton,
                            isActionLoading && styles.disabled,
                        ]}
                        onPress={handleToggleFreeze}
                        disabled={isActionLoading}
                    >
                        {isActionLoading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <Ionicons name={cardStatus ? 'pause' : 'play'} size={18} color="#FFF" />
                                <Text style={styles.actionText}>{cardStatus ? 'Freeze Card' : 'Unfreeze Card'}</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton, isActionLoading && styles.disabled]}
                        onPress={handleDeleteCard}
                        disabled={isActionLoading}
                    >
                        <Ionicons name="trash-outline" size={18} color="#FFF" />
                        <Text style={styles.actionText}>Delete Card</Text>
                    </TouchableOpacity>
                </View>
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
        fontWeight: '700',
        color: '#000',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    card: {
        borderRadius: 18,
        padding: 22,
        minHeight: 210,
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardBrand: {
        fontSize: 20,
        fontWeight: '700',
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
        fontWeight: '800',
        color: '#FFF',
        marginTop: 6,
    },
    cardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    cardLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.75)',
        marginBottom: 4,
    },
    cardInfo: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
    },
    infoSection: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 18,
        marginBottom: 18,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111',
        marginBottom: 14,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F2',
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
    },
    infoValue: {
        fontSize: 14,
        color: '#111',
        fontWeight: '600',
        maxWidth: '60%',
        textAlign: 'right',
    },
    statusActive: {
        color: '#2E7D32',
    },
    statusFrozen: {
        color: '#C62828',
    },
    actionsSection: {
        gap: 12,
        marginBottom: 30,
    },
    actionButton: {
        height: 52,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    freezeButton: {
        backgroundColor: '#EF6C00',
    },
    unfreezeButton: {
        backgroundColor: '#2E7D32',
    },
    deleteButton: {
        backgroundColor: '#C62828',
    },
    actionText: {
        fontSize: 15,
        color: '#FFF',
        fontWeight: '700',
    },
    disabled: {
        opacity: 0.6,
    },
});
