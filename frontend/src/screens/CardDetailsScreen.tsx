import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function CardDetailsScreen({ navigation, route }: any) {
    const { card } = route.params;
    const [cardStatus, setCardStatus] = useState(card?.isActive ?? true);
    const [foreignTransactions, setForeignTransactions] = useState(false);
    const [onlineTransactions, setOnlineTransactions] = useState(true);
    const [activeTab, setActiveTab] = useState('detail');
    const [modalVisible, setModalVisible] = useState(false);

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
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{card?.cardTier || 'GOLD'} {card?.cardType || 'Card'}</Text>
                <TouchableOpacity>
                    <Ionicons name="settings-outline" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'detail' && styles.activeTab]}
                        onPress={() => setActiveTab('detail')}
                    >
                        <Text style={[styles.tabText, activeTab === 'detail' && styles.activeTabText]}>
                            Detail Card
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
                        onPress={() => setActiveTab('transactions')}
                    >
                        <Text style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>
                            Transactions
                        </Text>
                    </TouchableOpacity>
                </View>

                <LinearGradient colors={getCardColors(card?.cardType)} style={styles.card}>
                    <View style={styles.cardTop}>
                        <Text style={styles.cardBrand}>Nexpay</Text>
                        <View style={styles.chipIcon} />
                    </View>
                    <Text style={styles.cardNumber}>
                        •••• •••• •••• {card?.cardNumber?.slice(-4) || '0000'}
                    </Text>
                    <Text style={styles.cardBalance}>${card?.balance?.toLocaleString() || '0.00'}</Text>
                    <View style={styles.cardBottom}>
                        <View>
                            <Text style={styles.cardLabel}>Card holder name</Text>
                            <Text style={styles.cardInfo}>{card?.cardholderName || 'Name'}</Text>
                        </View>
                        <View>
                            <Text style={styles.cardLabel}>Expiry date</Text>
                            <Text style={styles.cardInfo}>{card?.expiryDate || 'MM/YY'}</Text>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.limitSection}>
                    <View style={styles.limitHeader}>
                        <Text style={styles.sectionTitle}>Limit Settings</Text>
                        <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
                            <Ionicons name="create-outline" size={16} color="#FFF" />
                            <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.limitRow}>
                        <View style={styles.limitItem}>
                            <Text style={styles.limitLabel}>Transaction Limit</Text>
                            <Text style={styles.limitValue}>$5,000.00</Text>
                        </View>
                        <View style={styles.limitItem}>
                            <Text style={styles.limitLabel}>Withdraw Limit</Text>
                            <Text style={styles.limitValue}>$2,500.00</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.settingsSection}>
                    <View style={styles.settingRow}>
                        <Text style={styles.settingLabel}>Card Status</Text>
                        <View style={styles.settingRight}>
                            <Text style={[styles.statusText, cardStatus && styles.activeStatus]}>
                                {cardStatus ? 'Active' : 'Inactive'}
                            </Text>
                            <Switch
                                value={cardStatus}
                                onValueChange={setCardStatus}
                                trackColor={{ false: '#E0E0E0', true: '#FFD700' }}
                                thumbColor="#FFF"
                            />
                        </View>
                    </View>

                    <View style={styles.settingRow}>
                        <Text style={styles.settingLabel}>Foreign Transactions</Text>
                        <View style={styles.settingRight}>
                            <Text style={[styles.statusText, !foreignTransactions && styles.inactiveStatus]}>
                                {foreignTransactions ? 'Active' : 'Inactive'}
                            </Text>
                            <Switch
                                value={foreignTransactions}
                                onValueChange={setForeignTransactions}
                                trackColor={{ false: '#E0E0E0', true: '#FFD700' }}
                                thumbColor="#FFF"
                            />
                        </View>
                    </View>

                    <View style={styles.settingRow}>
                        <Text style={styles.settingLabel}>Online Transactions</Text>
                        <View style={styles.settingRight}>
                            <Text style={[styles.statusText, onlineTransactions && styles.activeStatus]}>
                                {onlineTransactions ? 'Active' : 'Inactive'}
                            </Text>
                            <Switch
                                value={onlineTransactions}
                                onValueChange={setOnlineTransactions}
                                trackColor={{ false: '#E0E0E0', true: '#FFD700' }}
                                thumbColor="#FFF"
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Card Settings</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalContent}>
                            <Text style={styles.sectionLabel}>Card Info</Text>

                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Card Type</Text>
                                <Text style={styles.infoValue}>{card?.cardTier || 'GOLD'}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Account Holder</Text>
                                <Text style={styles.infoValue}>{card?.cardholderName || 'Name'}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Account Number</Text>
                                <Text style={styles.infoValue}>{card?.cardNumber || '0000 0000 0000 0000'}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Expiry Date</Text>
                                <Text style={styles.infoValue}>{card?.expiryDate || 'MM/YY'}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>CVV</Text>
                                <Text style={styles.infoValue}>{card?.cvv || '***'}</Text>
                            </View>

                            <TouchableOpacity style={styles.actionRow}>
                                <View style={styles.actionLeft}>
                                    <Ionicons name="key-outline" size={20} color="#666" />
                                    <Text style={styles.actionText}>Change PIN Number</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#999" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionRow}>
                                <View style={styles.actionLeft}>
                                    <Ionicons name="lock-closed-outline" size={20} color="#666" />
                                    <Text style={styles.actionText}>Lock Card Temporarily</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#999" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionRow}>
                                <View style={styles.actionLeft}>
                                    <Ionicons name="close-circle-outline" size={20} color="#666" />
                                    <Text style={styles.actionText}>Block Card Permanently</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#999" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 25,
        padding: 4,
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 22,
    },
    activeTab: {
        backgroundColor: '#FFD700',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    activeTabText: {
        color: '#000',
    },
    card: {
        borderRadius: 16,
        padding: 20,
        height: 200,
        justifyContent: 'space-between',
        marginBottom: 20,
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
    limitSection: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
    },
    limitHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    editButtonText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#FFF',
    },
    limitRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    limitItem: {
        flex: 1,
    },
    limitLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 8,
    },
    limitValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    settingsSection: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 30,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    settingLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000',
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
    },
    activeStatus: {
        color: '#4CAF50',
    },
    inactiveStatus: {
        color: '#F44336',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 30,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    modalContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 15,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    infoLabel: {
        fontSize: 14,
        color: '#999',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        marginTop: 10,
    },
    actionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000',
    },
});
