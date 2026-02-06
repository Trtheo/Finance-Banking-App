import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const transactions = [
    { id: '1', title: 'Transfer to Johnss', amount: '- RWF 5,000', date: 'Today', type: 'debit' },
    { id: '2', title: 'Salary Deposit', amount: '+ RWF 1,500,000', date: 'Yesterday', type: 'credit' },
    { id: '3', title: 'Electric Bill', amount: '- RWF 15,000', date: 'Feb 4', type: 'debit' },
];

export default function DashboardScreen({ navigation }: any) {
    const [activeTab, setActiveTab] = useState('Home');
    const [menuVisible, setMenuVisible] = useState(false);

    const renderTransaction = ({ item }: { item: any }) => (
        <View style={styles.transactionItem}>
            <View style={styles.transactionIconContainer}>
                <Ionicons
                    name={item.type === 'credit' ? 'arrow-down' : 'arrow-up'}
                    size={20}
                    color={item.type === 'credit' ? '#4CAF50' : '#F44336'}
                />
            </View>
            <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{item.title}</Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
            </View>
            <Text style={[
                styles.transactionAmount,
                { color: item.type === 'credit' ? '#4CAF50' : '#333' }
            ]}>
                {item.amount}
            </Text>
        </View>
    );

    const renderDashboardContent = () => (
        <>
            <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Total Balance</Text>
                <Text style={styles.balanceAmount}>RWF 2,450,000</Text>
                <View style={styles.accountInfo}>
                    <Text style={styles.accountNumber}>**** **** **** 1234</Text>
                    <Text style={styles.bankName}>Bank of Kigali</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('FundTransfer')}>
                    <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
                        <Ionicons name="send" size={24} color="#2196F3" />
                    </View>
                    <Text style={styles.actionText}>Transfer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Transactions')}>
                    <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
                        <Ionicons name="time" size={24} color="#FF9800" />
                    </View>
                    <Text style={styles.actionText}>History</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <View style={[styles.actionIcon, { backgroundColor: '#F3E5F5' }]}>
                        <Ionicons name="add" size={24} color="#9C27B0" />
                    </View>
                    <Text style={styles.actionText}>Top Up</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.transactionsSection}>
                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                <FlatList
                    data={transactions}
                    renderItem={renderTransaction}
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                />
            </View>
        </>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'Home':
                return renderDashboardContent();
            case 'Payments':
                setMenuVisible(true);
                setActiveTab('Home');
                return renderDashboardContent();
            case 'Transactions':
                navigation.navigate('Transactions');
                setActiveTab('Home');
                return renderDashboardContent();
            case 'Wallet':
                return <View style={styles.tabContent}><Text style={styles.tabText}>Wallet Screen</Text></View>;
            case 'Profile':
                return <View style={styles.tabContent}><Text style={styles.tabText}>Profile Screen</Text></View>;
            default:
                return renderDashboardContent();
        }
    };

    const tabs = [
        { name: 'Home', icon: 'home' },
        { name: 'Payments', icon: 'card' },
        { name: 'Transactions', icon: 'list' },
        { name: 'Wallet', icon: 'wallet' },
        { name: 'Profile', icon: 'person' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, Michael</Text>
                    <Text style={styles.subGreeting}>Welcome back</Text>
                </View>
                <TouchableOpacity>
                    <Ionicons name="person-circle-outline" size={40} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {renderContent()}
            </ScrollView>

            <Modal visible={menuVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.sheetContainer}>
                        <View style={styles.menuHeader}>
                            <Text style={styles.menuTitle}>Menu</Text>
                            <TouchableOpacity onPress={() => setMenuVisible(false)}>
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {[
                                { title: 'Payments', data: [
                                    { id: '1', label: 'Internet', icon: 'wifi' },
                                    { id: '2', label: 'Electricity', icon: 'flash' },
                                    { id: '3', label: 'Water', icon: 'water' },
                                    { id: '4', label: 'Television', icon: 'tv' },
                                    { id: '5', label: 'Games', icon: 'game-controller' },
                                    { id: '6', label: 'Tax', icon: 'receipt' },
                                    { id: '7', label: 'Lifestyle', icon: 'bag' },
                                    { id: '8', label: 'VA Number', icon: 'phone-portrait' },
                                ]},
                                { title: 'Insurance', data: [
                                    { id: '9', label: 'Health', icon: 'heart' },
                                    { id: '10', label: 'Car', icon: 'car' },
                                    { id: '11', label: 'Motorcycle', icon: 'bicycle' },
                                    { id: '12', label: 'Property', icon: 'business' },
                                ]},
                                { title: 'Others', data: [
                                    { id: '13', label: 'Top Up', icon: 'wallet' },
                                    { id: '14', label: 'Investment', icon: 'trending-up' },
                                    { id: '15', label: 'Credit', icon: 'card' },
                                    { id: '16', label: 'Donate', icon: 'gift' },
                                ]},
                            ].map((section) => (
                                <View key={section.title} style={styles.section}>
                                    <Text style={styles.sectionTitle2}>{section.title}</Text>
                                    <View style={styles.grid2}>
                                        {section.data.map((item) => (
                                            <TouchableOpacity key={item.id} style={styles.itemContainer}>
                                                <View style={styles.iconCircle2}>
                                                    <Ionicons name={item.icon as any} size={24} color="#FFD700" />
                                                </View>
                                                <Text style={styles.itemLabel}>{item.label}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <View style={styles.footer}>
                {tabs.map((tab, index) => (
                    <React.Fragment key={tab.name}>
                        <TouchableOpacity 
                            style={styles.footerTab}
                            onPress={() => {
                                if (tab.name === 'Transactions') {
                                    navigation.navigate('Transactions');
                                } else {
                                    setActiveTab(tab.name);
                                }
                            }}
                        >
                            <Ionicons 
                                name={tab.icon as any} 
                                size={22} 
                                color={activeTab === tab.name ? '#1A237E' : '#888'} 
                            />
                            <Text style={[
                                styles.footerTabText,
                                activeTab === tab.name && styles.activeFooterTabText
                            ]}>
                                {tab.name}
                            </Text>
                        </TouchableOpacity>
                        {index < tabs.length - 1 && <View style={styles.footerSeparator} />}
                    </React.Fragment>
                ))}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    content: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 10,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subGreeting: {
        fontSize: 14,
        color: '#888',
    },
    footer: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingVertical: 8,
        paddingHorizontal: 5,
    },
    footerTab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 5,
    },
    footerTabText: {
        fontSize: 11,
        color: '#888',
        marginTop: 4,
        fontWeight: '500',
    },
    activeFooterTabText: {
        color: '#1A237E',
        fontWeight: 'bold',
    },
    footerSeparator: {
        width: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 8,
    },
    tabContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    paymentsContent: {
        flex: 1,
        padding: 20,
    },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    sheetContainer: { backgroundColor: '#FFF', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, maxHeight: '80%' },
    menuHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    menuTitle: { fontSize: 18, fontWeight: '700', flex: 1, textAlign: 'center' },
    section: { marginBottom: 25 },
    sectionTitle2: { fontSize: 16, fontWeight: '600', color: '#666', marginBottom: 15 },
    grid2: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
    itemContainer: { width: '25%', alignItems: 'center', marginBottom: 20 },
    iconCircle2: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    itemLabel: { fontSize: 11, color: '#333', textAlign: 'center' },
    tabText: {
        fontSize: 18,
        color: '#333',
        fontWeight: '600',
    },
    balanceCard: {
        backgroundColor: '#1A237E',
        borderRadius: 20,
        padding: 25,
        marginBottom: 30,
        shadowColor: '#1A237E',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    balanceLabel: {
        color: '#A5B0D6',
        fontSize: 14,
        marginBottom: 5,
    },
    balanceAmount: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    accountInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    accountNumber: {
        color: '#A5B0D6',
        fontSize: 14,
    },
    bankName: {
        color: '#FFD700',
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    actionButton: {
        alignItems: 'center',
        width: '22%',
    },
    actionIcon: {
        width: 60,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionText: {
        fontSize: 12,
        color: '#333',
        fontWeight: '500',
    },
    transactionsSection: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    transactionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    transactionDate: {
        fontSize: 12,
        color: '#888',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
