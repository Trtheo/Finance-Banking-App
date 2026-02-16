import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    RefreshControl, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as walletService from '../../services/walletService';
import * as transactionService from '../../services/transactionService';
import * as authService from '../../services/authService';
import * as notificationService from '../../services/notificationService';

const maskAccountNumber = (accountNumber?: string) => {
    const clean = String(accountNumber || '').replace(/\s/g, '');
    if (!clean) return '**** **** ****';
    if (clean.length <= 4) return clean;
    return `**** **** ${clean.slice(-4)}`;
};

const normalizeId = (value: any) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return String(value?._id || value);
};

const getTransactionDirection = (tx: any, currentUserId: string) => {
    const txType = String(tx?.type || '').toUpperCase();
    if (txType === 'DEPOSIT') return 'income';
    if (txType === 'TRANSFER') {
        const receiverId = normalizeId(tx?.receiverId);
        if (currentUserId && receiverId === currentUserId) return 'income';
    }
    return 'expense';
};

const ActionButton = ({ icon, label, color, onPress }: any) => (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
        <View style={[styles.iconCircle, { backgroundColor: color }]}>
            <Ionicons name={icon} size={24} color="black" />
        </View>
        <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
);

const TransactionItem = ({ name, type, amount, date, icon, color }: any) => (
    <View style={styles.transactionRow}>
        <View style={[styles.transIcon, { backgroundColor: color }]}>
            <Ionicons name={icon} size={22} color="black" />
        </View>
        <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.transName}>{name}</Text>
            <Text style={styles.transDate}>{date}</Text>
        </View>
        <Text style={[styles.transAmount, { color: type === 'income' ? '#4CAF50' : '#FF5252' }]}>
            {type === 'income' ? '+' : '-'}RWF {Math.abs(amount).toLocaleString()}
        </Text>
    </View>
);

export default function DashboardScreen({ navigation }: any) {
    const [wallet, setWallet] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isMainBalanceVisible, setIsMainBalanceVisible] = useState(true);

    const fetchData = async () => {
        try {
            const [walletResult, historyResult, userResult, unreadResult] = await Promise.allSettled([
                walletService.getWalletMe(),
                transactionService.getHistory(),
                authService.getMe(),
                notificationService.getUnreadCount(),
            ]);

            if (walletResult.status !== 'fulfilled') {
                throw walletResult.reason;
            }
            
            const unreadCount = unreadResult.status === 'fulfilled' ? Number(unreadResult.value || 0) : 0;

            let profile: any = { fullName: 'Nexpay User' };
            if (userResult.status === 'fulfilled' && userResult.value) {
                profile = userResult.value;
            } else {
                const storedUserData = await AsyncStorage.getItem('userData');
                if (storedUserData) {
                    try {
                        const parsedUser = JSON.parse(storedUserData);
                        const fallbackName = parsedUser?.fullName || parsedUser?.user?.fullName || parsedUser?.name;
                        if (fallbackName) {
                            profile = { ...parsedUser, fullName: fallbackName };
                        }
                    } catch {
                        console.error('Failed to parse stored user data');
                    }
                }
            }
            
            setWallet(walletResult.value);
            setTransactions(
                historyResult.status === 'fulfilled' && Array.isArray(historyResult.value)
                    ? historyResult.value.slice(0, 5)
                    : []
            );
            setUser(profile);
            setUnreadCount(unreadCount);
        } catch (error: any) {
            console.error('Error fetching dashboard data:', error.message);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchData(); // Refresh data when screen comes into focus
        }, [])
    );

    const onRefresh = () => {
        setIsRefreshing(true);
        fetchData();
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F9F9' }}>
                <ActivityIndicator size="large" color="#FFD700" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>Welcome back,</Text>
                    <Text style={styles.userName}>{user?.fullName || 'Nexpay User'}</Text>
                </View>
                <TouchableOpacity style={styles.notifBtn} onPress={() => navigation.navigate('Notification')}>
                    <Ionicons name="notifications-outline" size={24} color="black" />
                    {unreadCount > 0 && (
                        <View style={styles.notifBadge}>
                            <Text style={styles.notifBadgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#FFD700']} />
                }
            >
                <View style={styles.cardContainer}>
                    <View style={styles.mainCard}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.cardLabel}>Main Balance</Text>
                            <TouchableOpacity
                                style={styles.balanceToggleBtn}
                                onPress={() => setIsMainBalanceVisible(prev => !prev)}
                            >
                                <Ionicons
                                    name={isMainBalanceVisible ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color="black"
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.balanceText}>
                            {isMainBalanceVisible
                                ? `${wallet?.currency || 'RWF'} ${Number(wallet?.balance || 0).toLocaleString()}`
                                : `${wallet?.currency || 'RWF'} ••••••`}
                        </Text>
                        <View style={styles.cardFooter}>
                            <Text style={styles.accountNo}>{maskAccountNumber(wallet?.accountNumber)}</Text>
                            <Text style={styles.cardType}>Nexpay Card</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.actionsGrid}>
                    <ActionButton icon="send-outline" label="Transfer" color="#FFDE31" onPress={() => navigation.navigate('FundTransfer')} />
                    <ActionButton icon="download-outline" label="Deposit" color="#FFF9DB" onPress={() => navigation.navigate('Deposit')} />
                    <ActionButton icon="grid-outline" label="Withdraw" color="#FFF9DB" onPress={() => navigation.navigate('Withdraw')} />
                    <ActionButton icon="ellipsis-horizontal" label="More" color="#FFF9DB" onPress={() => navigation.navigate('Transactions')} />
                </View>

                <View style={styles.whitePanel}>
                    <View style={styles.transHeader}>
                        <Text style={styles.sectionTitle}>Latest Transactions</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
                            <Text style={styles.viewAllText}>View all</Text>
                        </TouchableOpacity>
                    </View>

                    {transactions.length > 0 ? (
                        transactions.map((tx: any) => {
                            const direction = getTransactionDirection(tx, normalizeId(user?._id));

                            return (
                                <TransactionItem
                                    key={tx._id || tx.id}
                                    name={tx.description || tx.type}
                                    date={new Date(tx.createdAt || tx.date).toLocaleDateString()}
                                    amount={Number(tx.amount || 0)}
                                    type={direction}
                                    icon={direction === 'income' ? 'arrow-down-outline' : 'arrow-up-outline'}
                                    color={direction === 'income' ? '#E8F5E9' : '#FFEBEE'}
                                />
                            );
                        })
                    ) : (
                        <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>No transactions yet</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F9F9F9' },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 25, paddingVertical: 15
    },
    welcomeText: { fontSize: 14, color: '#888' },
    userName: { fontSize: 18, fontWeight: '700' },
    notifBtn: {
        width: 45, height: 45, borderRadius: 15, backgroundColor: '#FFF',
        justifyContent: 'center', alignItems: 'center', elevation: 2
    },
    notifBadge: {
        position: 'absolute',
        top: 4,
        right: 2,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        paddingHorizontal: 4,
        backgroundColor: '#FF5252',
        borderWidth: 1,
        borderColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center'
    },
    notifBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
    scrollContent: { paddingTop: 10 },
    cardContainer: { paddingHorizontal: 25, marginBottom: 30 },
    mainCard: {
        backgroundColor: '#FFDE31', borderRadius: 30, padding: 25, height: 180,
        justifyContent: 'space-between', elevation: 4
    },
    cardLabel: { fontSize: 14, fontWeight: '500' },
    balanceToggleBtn: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.6)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    balanceText: { fontSize: 32, fontWeight: '800', marginTop: 10 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    accountNo: { fontSize: 16, fontWeight: '600' },
    cardType: { fontSize: 12, fontWeight: '500', opacity: 0.6 },
    actionsGrid: {
        flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, marginBottom: 35
    },
    actionBtn: { alignItems: 'center' },
    iconCircle: { width: 60, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    actionLabel: { fontSize: 13, fontWeight: '600' },
    whitePanel: {
        backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40,
        padding: 25, flex: 1, minHeight: 400
    },
    transHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '700' },
    viewAllText: { color: '#BDBDBD', fontSize: 14 },
    transactionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    transIcon: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    transName: { fontSize: 16, fontWeight: '600' },
    transDate: { fontSize: 12, color: '#BDBDBD', marginTop: 2 },
    transAmount: { fontSize: 16, fontWeight: '700' },
});
