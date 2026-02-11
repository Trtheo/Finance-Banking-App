import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    SafeAreaView, ActivityIndicator, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Notification {
    id: string;
    type: 'payment_request' | 'payment_success' | 'cashback' | 'transfer_success' | 'security';
    title: string;
    message: string;
    amount?: number;
    time: string;
    date: string;
    isToday: boolean;
    avatar?: string;
    status?: 'pending' | 'completed';
}

const NotificationItem = ({ notification, onAccept, onDecline }: {
    notification: Notification;
    onAccept?: () => void;
    onDecline?: () => void;
}) => {
    const getIcon = () => {
        switch (notification.type) {
            case 'payment_request':
                return { name: 'person-circle', color: '#FF9800', bg: '#FFF3E0' };
            case 'payment_success':
                return { name: 'checkmark-circle', color: '#4CAF50', bg: '#E8F5E9' };
            case 'cashback':
                return { name: 'gift', color: '#2196F3', bg: '#E3F2FD' };
            case 'transfer_success':
                return { name: 'arrow-up-circle', color: '#FFD700', bg: '#FFFDE7' };
            case 'security':
                return { name: 'shield-checkmark', color: '#F44336', bg: '#FFEBEE' };
            default:
                return { name: 'notifications', color: '#9E9E9E', bg: '#F5F5F5' };
        }
    };

    const icon = getIcon();

    return (
        <View style={styles.notificationItem}>
            <View style={[styles.iconContainer, { backgroundColor: icon.bg }]}>
                <Ionicons name={icon.name as any} size={24} color={icon.color} />
            </View>
            
            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.timeText}>{notification.time}</Text>
                </View>
                
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                
                {notification.amount && (
                    <Text style={styles.amountText}>
                        ${notification.amount.toLocaleString()}
                    </Text>
                )}
                
                {notification.type === 'payment_request' && (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.declineBtn} onPress={onDecline}>
                            <Text style={styles.declineBtnText}>Decline</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.acceptBtn} onPress={onAccept}>
                            <Text style={styles.acceptBtnText}>Accept</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

const EmptyNotifications = () => (
    <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
            <Ionicons name="notifications-off-outline" size={64} color="#BDBDBD" />
        </View>
        <Text style={styles.emptyTitle}>No Notification yet</Text>
        <Text style={styles.emptyMessage}>
            You will receive a notification if there{"\n"}is something on your account
        </Text>
    </View>
);

export default function NotificationScreen({ navigation }: any) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading notifications
        setTimeout(() => {
            // Empty notifications array to show empty state
            const mockNotifications: Notification[] = [];
            
            setNotifications(mockNotifications);
            setIsLoading(false);
        }, 1000);
    }, []);

    const handleAccept = (notificationId: string) => {
        // Handle accept payment request
        console.log('Accept payment request:', notificationId);
    };

    const handleDecline = (notificationId: string) => {
        // Handle decline payment request
        console.log('Decline payment request:', notificationId);
    };

    const todayNotifications = notifications.filter(n => n.isToday);
    const yesterdayNotifications = notifications.filter(n => !n.isToday);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFD700" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notification</Text>
                <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {notifications.length === 0 ? (
                <EmptyNotifications />
            ) : (
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {todayNotifications.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Today</Text>
                            {todayNotifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onAccept={() => handleAccept(notification.id)}
                                    onDecline={() => handleDecline(notification.id)}
                                />
                            ))}
                        </View>
                    )}

                    {yesterdayNotifications.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Yesterday</Text>
                            {yesterdayNotifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onAccept={() => handleAccept(notification.id)}
                                    onDecline={() => handleDecline(notification.id)}
                                />
                            ))}
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#F9F9F9',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    moreButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginBottom: 15,
        marginTop: 10,
    },
    notificationItem: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    contentContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        flex: 1,
        marginRight: 8,
    },
    timeText: {
        fontSize: 12,
        color: '#999',
    },
    notificationMessage: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 8,
    },
    amountText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 12,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    declineBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 25,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
    },
    declineBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    acceptBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 25,
        backgroundColor: '#FFD700',
        alignItems: 'center',
    },
    acceptBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: 100,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        marginBottom: 16,
    },
    emptyMessage: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        lineHeight: 20,
    },
});