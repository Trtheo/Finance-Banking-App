import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PAYMENT_SERVICE_CONFIGS } from '../../constants/paymentServices';

export default function PaymentsScreen({ navigation }: any) {
    const groupedSections = useMemo(() => {
        const sections = ['Payments', 'Insurance', 'Others'] as const;
        return sections.map((sectionTitle) => ({
            title: sectionTitle,
            data: PAYMENT_SERVICE_CONFIGS.filter((item) => item.section === sectionTitle),
        }));
    }, []);

    const openPayment = (serviceKey: string, serviceLabel: string) => {
        navigation.navigate('InternetPayment', { serviceKey, serviceLabel });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Payments</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {groupedSections.map((section) => (
                    <View key={section.title} style={styles.section}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <View style={styles.grid}>
                            {section.data.map((item) => (
                                <TouchableOpacity
                                    key={item.key}
                                    style={styles.itemContainer}
                                    onPress={() => openPayment(item.key, item.label)}
                                >
                                    <View style={styles.iconCircle}>
                                        <Ionicons name={item.icon as any} size={24} color="#FFD700" />
                                    </View>
                                    <Text style={styles.itemLabel}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F9FC' },
    header: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    section: { marginBottom: 25 },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: '#666', marginBottom: 15 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
    itemContainer: { width: '25%', alignItems: 'center', marginBottom: 20 },
    iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    itemLabel: { fontSize: 11, color: '#333', textAlign: 'center' },
});
