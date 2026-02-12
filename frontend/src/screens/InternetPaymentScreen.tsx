import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Modal,
    FlatList,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const PROVIDERS = [
    { id: 'comcast', name: 'Comcast', icon: 'logo-github' }, // Placeholder icons
    { id: 'spectrum', name: 'Spectrum', icon: 'logo-twitter' },
    { id: 'at&t', name: 'AT&T', icon: 'logo-google' },
    { id: 'verizon', name: 'Verizon', icon: 'logo-apple' },
    { id: 'charter', name: 'Charter', icon: 'logo-venmo' },
];

const LATEST_PAYMENTS = [
    { id: '1', name: 'Michael John', provider: 'Spectrum', accountId: '9236430' },
    { id: '2', name: 'Abraham Lincoln', provider: 'Comcast', accountId: '10218332' },
];

export default function InternetPaymentScreen({ navigation }: any) {
    const [selectedProvider, setSelectedProvider] = useState<any>(null);
    const [customerId, setCustomerId] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleContinue = () => {
        if (selectedProvider && customerId) {
            navigation.navigate('InternetPaymentSummary', {
                provider: selectedProvider,
                customerId: customerId,
            });
        }
    };

    const renderProviderItem = ({ item }: any) => (
        <TouchableOpacity
            style={styles.providerItem}
            onPress={() => {
                setSelectedProvider(item);
                setIsModalVisible(false);
            }}
        >
            <View style={styles.providerLeft}>
                <View style={styles.providerIconCircle}>
                    <Ionicons name={item.icon} size={20} color="#666" />
                </View>
                <Text style={styles.providerNameText}>{item.name}</Text>
            </View>
            <View style={[
                styles.radioCircle,
                selectedProvider?.id === item.id && styles.radioCircleActive
            ]}>
                {selectedProvider?.id === item.id && <View style={styles.radioInner} />}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Internet</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.iconContainer}>
                    <View style={styles.wifiCircle}>
                        <Ionicons name="wifi" size={32} color="#FF5252" />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Latest Payment</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                        {LATEST_PAYMENTS.map((payment) => (
                            <TouchableOpacity key={payment.id} style={styles.latestPaymentCard}>
                                <Text style={styles.latestName}>{payment.name}</Text>
                                <Text style={styles.latestDetails}>{payment.provider} • {payment.accountId}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>New Payment</Text>

                    <Text style={styles.label}>Select Provider</Text>
                    <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => setIsModalVisible(true)}
                    >
                        <View style={styles.dropdownLeft}>
                            <Ionicons name="wifi-outline" size={20} color="#CCC" style={{ marginRight: 10 }} />
                            <Text style={[styles.dropdownText, !selectedProvider && { color: '#CCC' }]}>
                                {selectedProvider ? selectedProvider.name : 'Choose internet provider'}
                            </Text>
                        </View>
                        <Ionicons name="chevron-down" size={20} color="#666" />
                    </TouchableOpacity>

                    <Text style={[styles.label, { marginTop: 20 }]}>Customer ID</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color="#CCC" style={{ marginRight: 10 }} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter the customer ID"
                            placeholderTextColor="#CCC"
                            value={customerId}
                            onChangeText={setCustomerId}
                            keyboardType="numeric"
                        />
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.continueButton, (!selectedProvider || !customerId) && styles.continueButtonDisabled]}
                    onPress={handleContinue}
                    disabled={!selectedProvider || !customerId}
                >
                    <Text style={[styles.continueText, (!selectedProvider || !customerId) && styles.continueTextDisabled]}>
                        Continue
                    </Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View style={{ width: 24 }} />
                            <Text style={styles.modalTitle}>Select Provider</Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={PROVIDERS}
                            keyExtractor={(item) => item.id}
                            renderItem={renderProviderItem}
                            contentContainerStyle={styles.listContent}
                        />
                        <TouchableOpacity
                            style={[styles.modalButton, !selectedProvider && styles.continueButtonDisabled]}
                            onPress={() => setIsModalVisible(false)}
                            disabled={!selectedProvider}
                        >
                            <Text style={styles.modalButtonText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: { fontSize: 18, fontWeight: '600' },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
    iconContainer: { alignItems: 'center', marginVertical: 30 },
    wifiCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#FFF0F0',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    section: { marginBottom: 30 },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15, color: '#333' },
    horizontalScroll: { flexDirection: 'row' },
    latestPaymentCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 15,
        marginRight: 15,
        width: 160,
    },
    latestName: { fontSize: 14, fontWeight: '600', color: '#333' },
    latestDetails: { fontSize: 12, color: '#999', marginTop: 4 },
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 10 },
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEE',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 55,
    },
    dropdownLeft: { flexDirection: 'row', alignItems: 'center' },
    dropdownText: { fontSize: 14, color: '#333' },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEE',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 55,
    },
    input: { flex: 1, fontSize: 14, color: '#333' },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: '#FFF',
    },
    continueButton: {
        backgroundColor: '#FFDB15', // Gold yellow from design
        borderRadius: 30,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueButtonDisabled: { backgroundColor: '#F0F0F0' },
    continueText: { fontSize: 16, fontWeight: '700', color: '#000' },
    continueTextDisabled: { color: '#CCC' },
    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 30,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        padding: 20,
    },
    modalTitle: { fontSize: 18, fontWeight: '700' },
    listContent: { padding: 20 },
    providerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
    },
    providerLeft: { flexDirection: 'row', alignItems: 'center' },
    providerIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    providerNameText: { fontSize: 16, color: '#333' },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#EEE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioCircleActive: { borderColor: '#FFDB15' },
    radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFDB15' },
    modalButton: {
        backgroundColor: '#FFDB15',
        borderRadius: 30,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 10,
    },
    modalButtonText: { fontSize: 16, fontWeight: '700', color: '#000' },
});
