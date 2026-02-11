import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CardManagementScreen({ navigation }: any) {
    const [cards, setCards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchCards();
        });
        return unsubscribe;
    }, [navigation]);

    const fetchCards = async () => {
        try {
            setIsLoading(true);
            // Get cards from local storage instead of API
            const storedCards = await AsyncStorage.getItem('userCards');
            const cards = storedCards ? JSON.parse(storedCards) : [];
            setCards(cards);
        } catch (error: any) {
            console.log('Error fetching cards:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCardPress = (card: any) => {
        navigation.navigate('CardDetails', { card });
    };

    const handleAddCard = () => {
        navigation.navigate('AddCard');
    };

    const handleCardAction = async (cardId: string, action: string) => {
        switch (action) {
            case 'freeze':
                Alert.alert('Freeze Card', 'Are you sure you want to freeze this card?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Freeze', onPress: () => freezeCard(cardId) }
                ]);
                break;
            case 'delete':
                Alert.alert('Delete Card', 'Are you sure you want to delete this card?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => deleteCardAPI(cardId) }
                ]);
                break;
        }
    };

    const freezeCard = async (cardId: string) => {
        try {
            const storedCards = await AsyncStorage.getItem('userCards');
            const cards = storedCards ? JSON.parse(storedCards) : [];
            const updatedCards = cards.map((card: any) => 
                card._id === cardId ? { ...card, isActive: !card.isActive } : card
            );
            await AsyncStorage.setItem('userCards', JSON.stringify(updatedCards));
            await fetchCards();
            Alert.alert('Success', 'Card status updated');
        } catch (error: any) {
            Alert.alert('Error', 'Failed to update card');
        }
    };

    const deleteCardAPI = async (cardId: string) => {
        try {
            const storedCards = await AsyncStorage.getItem('userCards');
            const cards = storedCards ? JSON.parse(storedCards) : [];
            const updatedCards = cards.filter((card: any) => card._id !== cardId);
            await AsyncStorage.setItem('userCards', JSON.stringify(updatedCards));
            await fetchCards();
            Alert.alert('Success', 'Card deleted successfully');
        } catch (error: any) {
            Alert.alert('Error', 'Failed to delete card');
        }
    };

    const getCardColors = (cardType: string) => {
        switch (cardType?.toUpperCase()) {
            case 'CREDIT':
                return ['#D4AF37', '#B8941F', '#8B7355'];
            case 'DEBIT':
                return ['#2C2C2C', '#1A1A1A'];
            case 'PREPAID':
                return ['#4A90E2', '#357ABD'];
            default:
                return ['#2C2C2C', '#1A1A1A'];
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Card Management</Text>
                <TouchableOpacity onPress={handleAddCard}>
                    <Ionicons name="add" size={24} color="#000" />
                </TouchableOpacity>
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
                                <Text style={styles.cardLabel}>{card.cardTier || 'GOLD'} {card.cardType} Card</Text>
                                <View style={styles.cardActions}>
                                    <TouchableOpacity 
                                        style={styles.actionButton}
                                        onPress={() => handleCardAction(card._id, 'freeze')}
                                    >
                                        <Ionicons 
                                            name={card.isActive ? "pause" : "play"} 
                                            size={16} 
                                            color="#666" 
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.actionButton}
                                        onPress={() => handleCardAction(card._id, 'delete')}
                                    >
                                        <Ionicons name="trash-outline" size={16} color="#FF5252" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleCardPress(card)}>
                                        <Ionicons name="arrow-forward" size={20} color="#000" />
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
                                        •••• •••• •••• {card.cardNumber.slice(-4)}
                                    </Text>
                                    <Text style={styles.cardBalance}>${card.balance?.toLocaleString() || '0.00'}</Text>
                                    <View style={styles.cardBottom}>
                                        <View>
                                            <Text style={styles.cardLabel2}>Card holder name</Text>
                                            <Text style={styles.cardInfo}>{card.cardholderName}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.cardLabel2}>Expiry date</Text>
                                            <Text style={styles.cardInfo}>{card.expiryDate}</Text>
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
        gap: 15,
    },
    actionButton: {
        padding: 5,
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