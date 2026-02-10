import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationSettingsScreen({ navigation }: any) {
    const [appNotification, setAppNotification] = useState(true);
    const [emailNotification, setEmailNotification] = useState(true);
    const [smsNotification, setSmsNotification] = useState(false);
    const [transferNotification, setTransferNotification] = useState(true);
    const [paymentNotification, setPaymentNotification] = useState(true);
    const [incomingFunds, setIncomingFunds] = useState(false);
    const [moneyRequest, setMoneyRequest] = useState(true);
    const [exclusiveDeals, setExclusiveDeals] = useState(false);
    const [newFeatures, setNewFeatures] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notification Settings</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>General</Text>

                    <View style={styles.menuItem}>
                        <Ionicons name="notifications-outline" size={22} color="#666" />
                        <Text style={styles.menuText}>App Notification</Text>
                        <Switch value={appNotification} onValueChange={setAppNotification} trackColor={{ true: '#FFD700' }} />
                    </View>

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="musical-notes-outline" size={22} color="#666" />
                        <Text style={styles.menuText}>Notification Sound</Text>
                        <Text style={styles.menuValue}>Default</Text>
                        <Ionicons name="chevron-forward" size={18} color="#999" />
                    </TouchableOpacity>

                    <View style={styles.menuItem}>
                        <Ionicons name="mail-outline" size={22} color="#666" />
                        <Text style={styles.menuText}>Email Notification</Text>
                        <Switch value={emailNotification} onValueChange={setEmailNotification} trackColor={{ true: '#FFD700' }} />
                    </View>

                    <View style={styles.menuItem}>
                        <Ionicons name="chatbox-outline" size={22} color="#666" />
                        <Text style={styles.menuText}>SMS Notification</Text>
                        <Switch value={smsNotification} onValueChange={setSmsNotification} trackColor={{ true: '#FFD700' }} />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Transaction Alerts</Text>

                    <View style={styles.menuItem}>
                        <Ionicons name="swap-horizontal-outline" size={22} color="#666" />
                        <Text style={styles.menuText}>Transfer Notification</Text>
                        <Switch value={transferNotification} onValueChange={setTransferNotification} trackColor={{ true: '#FFD700' }} />
                    </View>

                    <View style={styles.menuItem}>
                        <Ionicons name="card-outline" size={22} color="#666" />
                        <Text style={styles.menuText}>Payment Notification</Text>
                        <Switch value={paymentNotification} onValueChange={setPaymentNotification} trackColor={{ true: '#FFD700' }} />
                    </View>

                    <View style={styles.menuItem}>
                        <Ionicons name="arrow-down-circle-outline" size={22} color="#666" />
                        <Text style={styles.menuText}>Incoming Funds</Text>
                        <Switch value={incomingFunds} onValueChange={setIncomingFunds} trackColor={{ true: '#FFD700' }} />
                    </View>

                    <View style={styles.menuItem}>
                        <Ionicons name="cash-outline" size={22} color="#666" />
                        <Text style={styles.menuText}>Money Request</Text>
                        <Switch value={moneyRequest} onValueChange={setMoneyRequest} trackColor={{ true: '#FFD700' }} />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Promotions and Offers</Text>

                    <View style={styles.menuItem}>
                        <Ionicons name="pricetag-outline" size={22} color="#666" />
                        <Text style={styles.menuText}>Exclusive Deals and Promo</Text>
                        <Switch value={exclusiveDeals} onValueChange={setExclusiveDeals} trackColor={{ true: '#FFD700' }} />
                    </View>

                    <View style={styles.menuItem}>
                        <Ionicons name="sparkles-outline" size={22} color="#666" />
                        <Text style={styles.menuText}>New Features</Text>
                        <Switch value={newFeatures} onValueChange={setNewFeatures} trackColor={{ true: '#FFD700' }} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    scrollView: {
        flex: 1,
    },
    section: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 13,
        color: '#999',
        marginBottom: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    menuText: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        marginLeft: 12,
    },
    menuValue: {
        fontSize: 14,
        color: '#999',
        marginRight: 8,
    },
});
