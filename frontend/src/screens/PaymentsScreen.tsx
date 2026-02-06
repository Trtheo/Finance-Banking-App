import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentsScreen() {
    const [selectedBill, setSelectedBill] = useState<string | null>(null);
    const [menuVisible, setMenuVisible] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mainContent}>
                <Text style={styles.title}>Payments</Text>
                <TouchableOpacity 
                    style={styles.openMenuButton}
                    onPress={() => setMenuVisible(true)}
                >
                    <Text style={styles.openMenuText}>Open Payment Menu</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={menuVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.sheetContainer}>
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>Menu</Text>
                            <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.closeButton}>
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
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                    <View style={styles.grid}>
                                        {section.data.map((item) => (
                                            <TouchableOpacity 
                                                key={item.id} 
                                                style={styles.itemContainer}
                                                onPress={() => {
                                                    setSelectedBill(item.label);
                                                    setMenuVisible(false);
                                                }}
                                            >
                                                <View style={[
                                                    styles.iconCircle,
                                                    selectedBill === item.label && styles.selectedCircle
                                                ]}>
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

            {selectedBill && (
                <View style={styles.selectedBanner}>
                    <Text style={styles.selectedText}>Selected: {selectedBill}</Text>
                    <TouchableOpacity onPress={() => setSelectedBill(null)}>
                        <Ionicons name="close-circle" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F9FC' },
    mainContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 },
    openMenuButton: { backgroundColor: '#1A237E', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 12 },
    openMenuText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    sheetContainer: { backgroundColor: '#FFF', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, maxHeight: '80%' },
    header: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20, position: 'relative' },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    closeButton: { position: 'absolute', right: 0 },
    section: { marginBottom: 25 },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: '#666', marginBottom: 15 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
    itemContainer: { width: '25%', alignItems: 'center', marginBottom: 20 },
    iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    selectedCircle: { backgroundColor: '#1A237E', borderWidth: 2, borderColor: '#FFD700' },
    itemLabel: { fontSize: 11, color: '#333', textAlign: 'center' },
    selectedBanner: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1A237E',
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
