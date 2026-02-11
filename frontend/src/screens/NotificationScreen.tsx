import React, { useEffect, useMemo, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    SafeAreaView, ActivityIndicator, RefreshControl, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as notificationService from '../services/notificationService';

type NotificationType = 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER_SENT' | 'TRANSFER_RECEIVED';

interface ApiNotification {
    _id: string;
    type: NotificationType;
    title: string;
    message: string;
    amount?: number;
    reference?: string;
    isRead: boolean;
    createdAt: string;
}

const getIcon = (type: NotificationType) => {
    switch (type) {
        case 'DEPOSIT':
            return { name: 'arrow-down-circle', color: '#2E7D32', bg: '#E8F5E9' };
        case 'WITHDRAW':
            return { name: 'arrow-up-circle', color: '#C62828', bg: '#FFEBEE' };
        case 'TRANSFER_SENT':
            return { name: 'send', color: '#EF6C00', bg: '#FFF3E0' };
        case 'TRANSFER_RECEIVED':
            return { name: 'download', color: '#1565C0', bg: '#E3F2FD' };
        default:
            return { name: 'notifications', color: '#9E9E9E', bg: '#F5F5F5' };
    }
};

const isSameDay = (left: Date, right: Date) => (
    left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate()
);

const isToday = (dateString: string) => {
    const created = new Date(dateString);
    return isSameDay(created, new Date());
};

const formatTime = (dateString: string) => (
    new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
);

const NotificationItem = ({ item, onPress }: { item: ApiNotification; onPress: () => void }) => {
    const icon = getIcon(item.type);

    return (
        <TouchableOpacity
            style={[styles.notificationItem, !item.isRead && styles.unreadItem]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={[styles.iconContainer, { backgroundColor: icon.bg }]}>
                <Ionicons name={icon.name as any} size={22} color={icon.color} />
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.notificationTitle}>{item.title}</Text>
                    <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
                </View>

                <Text style={styles.notificationMessage}>{item.message}</Text>

                {typeof item.amount === 'number' && (
                    <Text style={styles.amountText}>RWF {item.amount.toLocaleString()}</Text>
                )}

                {item.reference && (
                    <Text style={styles.referenceText}>Ref: {item.reference}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const EmptyNotifications = () => (
    <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
            <Ionicons name="notifications-off-outline" size={64} color="#BDBDBD" />
        </View>
        <Text style={styles.emptyTitle}>No Notifications Yet</Text>
        <Text style={styles.emptyMessage}>New transaction alerts will appear here.</Text>
    </View>
);

export default function NotificationScreen({ navigation }: any) {
    const [notifications, setNotifications] = useState<ApiNotification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchNotifications = async (showLoader = false) => {
        if (showLoader) {
            setIsLoading(true);
        }

        try {
            const data = await notificationService.getMyNotifications();
            setNotifications(data);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to load notifications');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchNotifications(true);
    }, []);

    const onRefresh = () => {
        setIsRefreshing(true);
        fetchNotifications(false);
    };

    const markAsRead = async (notificationId: string) => {
        const target = notifications.find(item => item._id === notificationId);
        if (!target || target.isRead) {
            return;
        }

        setNotifications(prev =>
            prev.map(item =>
                item._id === notificationId ? { ...item, isRead: true } : item
            )
        );

        try {
            await notificationService.markNotificationAsRead(notificationId);
        } catch {
            // Keep optimistic UI behavior even if the backend call fails.
        }
    };

    const markAllAsRead = async () => {
        const hasUnread = notifications.some(item => !item.isRead);
        if (!hasUnread) {
            return;
        }

        setNotifications(prev => prev.map(item => ({ ...item, isRead: true })));

        try {
            await notificationService.markAllNotificationsAsRead();
        } catch {
            // Keep optimistic UI behavior even if the backend call fails.
        }
    };

    const todayNotifications = useMemo(
        () => notifications.filter(item => isToday(item.createdAt)),
        [notifications]
    );

    const earlierNotifications = useMemo(
        () => notifications.filter(item => !isToday(item.createdAt)),
        [notifications]
    );

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

                <Text style={styles.headerTitle}>Notifications</Text>

                <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
                    <Text style={styles.markAllText}>Mark all</Text>
                </TouchableOpacity>
            </View>

            {notifications.length === 0 ? (
                <EmptyNotifications />
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    refreshControl={(
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                            colors={['#FFD700']}
                        />
                    )}
                >
                    {todayNotifications.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Today</Text>
                            {todayNotifications.map((item) => (
                                <NotificationItem
                                    key={item._id}
                                    item={item}
                                    onPress={() => markAsRead(item._id)}
                                />
                            ))}
                        </View>
                    )}

                    {earlierNotifications.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Earlier</Text>
                            {earlierNotifications.map((item) => (
                                <NotificationItem
                                    key={item._id}
                                    item={item}
                                    onPress={() => markAsRead(item._id)}
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
    markAllButton: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#FFF',
    },
    markAllText: {
        fontSize: 12,
        color: '#444',
        fontWeight: '600',
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
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.07,
        shadowRadius: 3,
    },
    unreadItem: {
        borderWidth: 1,
        borderColor: '#FFE082',
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
        fontSize: 15,
        fontWeight: '700',
        color: '#000',
        marginBottom: 6,
    },
    referenceText: {
        fontSize: 12,
        color: '#888',
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
        marginBottom: 10,
    },
    emptyMessage: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        lineHeight: 20,
    },
});
