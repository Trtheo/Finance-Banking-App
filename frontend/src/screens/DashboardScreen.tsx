import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Dimensions, RefreshControl, ActivityIndicator, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

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
            {type === 'income' ? '+' : '-'}${Math.abs(amount).toLocaleString()}
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

    const fetchData = async () => {
        try {
            // Get balance from local storage
            const storedBalance = await AsyncStorage.getItem('userBalance');
            const balance = storedBalance ? parseFloat(storedBalance) : 1000.00;
            
            // Get transactions from local storage
            const storedTransactions = await AsyncStorage.getItem('internetPayments');
            const transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
            
            // Get unread notifications count
            const storedNotifications = await AsyncStorage.getItem('notifications');
            const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];
            const unreadCount = notifications.filter((n: any) => !n.read).length;
            
            setWallet({ balance, currency: 'USD', accountNumber: '**** **** 1234' });
            setTransactions(transactions.slice(0, 5));
            setUser({ fullName: 'Nexpay User' });
            setUnreadCount(unreadCount);
        } catch (error: any) {
            console.error('Error fetching dashboard data:', error.message);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
                            <MaterialCommunityIcons name="dots-horizontal" size={24} color="black" />
                        </View>
                        <Text style={styles.balanceText}>
                            ${wallet?.balance?.toLocaleString() || '0'}
                        </Text>
                        <View style={styles.cardFooter}>
                            <Text style={styles.accountNo}>{wallet?.accountNumber || '**** **** ****'}</Text>
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
                        transactions.map((tx: any) => (
                            <TransactionItem
                                key={tx.id}
                                name={tx.type}
                                date={new Date(tx.date).toLocaleDateString()}
                                amount={tx.amount}
                                type='expense'
                                icon='arrow-up-outline'
                                color='#FFEBEE'
                            />
                        ))
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
