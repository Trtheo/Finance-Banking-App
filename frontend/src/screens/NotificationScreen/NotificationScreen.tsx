import React, { useMemo, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    SafeAreaView, ActivityIndicator, RefreshControl, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as notificationService from '../../services/notificationService';

interface AppNotification {
    _id: string;
    title: string;
    message: string;
    type: string;
    amount?: number;
    reference?: string;
    cardLast4?: string;
    isRead: boolean;
    createdAt: string;
}

const getIcon = (type: string) => {
    switch (String(type).toUpperCase()) {
        case 'DEPOSIT':
            return { name: 'arrow-down-circle', color: '#2E7D32', bg: '#E8F5E9' };
        case 'WITHDRAW':
        case 'TRANSFER_SENT':
            return { name: 'arrow-up-circle', color: '#C62828', bg: '#FFEBEE' };
        case 'TRANSFER_RECEIVED':
            return { name: 'arrow-down-circle', color: '#2E7D32', bg: '#E8F5E9' };
        default:
            return { name: 'notifications', color: '#9E9E9E', bg: '#F5F5F5' };
    }
};

const isSameDay = (left: Date, right: Date) => (
    left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate()
);

const isToday = (dateValue: string) => {
    const created = new Date(dateValue);
    return isSameDay(created, new Date());
};

const formatTime = (dateValue: string) => (
    new Date(dateValue).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
);

const NotificationItem = ({ item, onPress, onDelete }: { item: AppNotification; onPress: () => void; onDelete: () => void }) => {
    const icon = getIcon(item.type);

    const handleDelete = () => {
        Alert.alert(
            'Delete Notification',
            'Are you sure you want to delete this notification?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: onDelete }
            ]
        );
    };

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
                    <View style={styles.actionRow}>
                        <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
                        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                            <Ionicons name="trash-outline" size={16} color="#FF6B6B" />
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.notificationMessage}>{item.message}</Text>

                {typeof item.amount === 'number' && (
                    <Text style={styles.amountText}>RWF {Number(item.amount || 0).toLocaleString()}</Text>
                )}

                {item.cardLast4 && (
                    <Text style={styles.cardText}>Card ••••{item.cardLast4}</Text>
                )}
            </View>

            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                <Ionicons name="trash-outline" size={20} color="#FF5252" />
            </TouchableOpacity>
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
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchNotifications = async (showLoader = false) => {
        if (showLoader) {
            setIsLoading(true);
        }

        try {
            const data = await notificationService.getMyNotifications(100);
            setNotifications(Array.isArray(data) ? data : []);
        } catch (error: any) {
            console.log('Error loading notifications:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to load notifications');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchNotifications(true);
        }, [])
    );

    const onRefresh = () => {
        setIsRefreshing(true);
        fetchNotifications(false);
    };

    const markAsRead = async (notificationId: string) => {
        const target = notifications.find(item => item._id === notificationId);
        if (!target || target.isRead) return;

        setNotifications(prev =>
            prev.map(item => (item._id === notificationId ? { ...item, isRead: true } : item))
        );

        try {
            await notificationService.markNotificationAsRead(notificationId);
        } catch (error: any) {
            setNotifications(prev =>
                prev.map(item => (item._id === notificationId ? { ...item, isRead: false } : item))
            );
            Alert.alert('Error', error.response?.data?.message || 'Failed to mark notification as read');
        }
    };

    const deleteNotification = async (notificationId: string) => {
        Alert.alert(
            'Delete Notification',
            'Are you sure you want to delete this notification?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const previousNotifications = [...notifications];
                        setNotifications(prev => prev.filter(item => item._id !== notificationId));

                        try {
                            await notificationService.deleteNotification(notificationId);
                        } catch (error: any) {
                            setNotifications(previousNotifications);
                            Alert.alert('Error', error.response?.data?.message || 'Failed to delete notification');
                        }
                    }
                }
            ]
        );
    };

    const markAllAsRead = async () => {
        const hasUnread = notifications.some(item => !item.isRead);
        if (!hasUnread) return;

        const previousNotifications = [...notifications];
        setNotifications(prev => prev.map(item => ({ ...item, isRead: true })));
        try {
            await notificationService.markAllNotificationsAsRead();
        } catch (error: any) {
            setNotifications(previousNotifications);
            Alert.alert('Error', error.response?.data?.message || 'Failed to mark all notifications as read');
        }
    };

    const deleteNotification = async (notificationId: string) => {
        setNotifications(prev => prev.filter(item => item._id !== notificationId));
        
        try {
            await notificationService.deleteNotification(notificationId);
        } catch (error: any) {
            await fetchNotifications(false);
            Alert.alert('Error', error.response?.data?.message || 'Failed to delete notification');
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
                    <Text style={styles.markAllText}>Mark all as read</Text>
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
                                    onDelete={() => deleteNotification(item._id)}
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
                                    onDelete={() => deleteNotification(item._id)}
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
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#FFF',
        elevation: 1,
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
        alignItems: 'flex-start',
    },
    unreadItem: {
        borderWidth: 1,
        borderColor: '#FFE082',
        backgroundColor: '#FFFBF0',
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
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    deleteButton: {
        padding: 4,
        borderRadius: 4,
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
    cardText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
        marginBottom: 4,
    },
    referenceText: {
        fontSize: 12,
        color: '#888',
    },
    deleteButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#FFEBEE',
        alignSelf: 'center',
        marginLeft: 4,
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
