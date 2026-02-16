import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Modal,
    FlatList,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getPaymentServiceByKey, PaymentField } from '../../constants/paymentServices';

const buildInitialFormValues = (fields: PaymentField[]) => (
    fields.reduce((acc: Record<string, string>, field) => {
        acc[field.key] = '';
        return acc;
    }, {})
);

export default function InternetPaymentScreen({ navigation, route }: any) {
    const serviceKey = route?.params?.serviceKey;
    const serviceConfig = useMemo(() => getPaymentServiceByKey(serviceKey), [serviceKey]);

    const [selectedProvider, setSelectedProvider] = useState<any>(null);
    const [formValues, setFormValues] = useState<Record<string, string>>(buildInitialFormValues(serviceConfig.fields));
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        setSelectedProvider(null);
        setFormValues(buildInitialFormValues(serviceConfig.fields));
    }, [serviceConfig]);

    const updateField = (fieldKey: string, value: string) => {
        setFormValues(prev => ({ ...prev, [fieldKey]: value }));
    };

    const getMissingRequirementMessage = () => {
        const standaloneRequiredFields = serviceConfig.fields.filter(
            (field) => field.required !== false && !field.alternativeGroup
        );
        const missingStandaloneField = standaloneRequiredFields.find(
            (field) => !String(formValues[field.key] || '').trim()
        );
        if (missingStandaloneField) {
            return `${missingStandaloneField.label} is required.`;
        }

        const alternativeGroups = Array.from(
            new Set(
                serviceConfig.fields
                    .map((field) => field.alternativeGroup)
                    .filter(Boolean)
            )
        ) as string[];

        for (const groupKey of alternativeGroups) {
            const groupedFields = serviceConfig.fields.filter((field) => field.alternativeGroup === groupKey);
            const hasAnyGroupValue = groupedFields.some((field) => String(formValues[field.key] || '').trim().length > 0);

            if (!hasAnyGroupValue) {
                const labels = groupedFields.map((field) => field.label).join(' or ');
                return `${labels} is required.`;
            }
        }

        return null;
    };

    const hasMissingRequiredField = () => Boolean(getMissingRequirementMessage());

    const handleContinue = () => {
        if (!selectedProvider) {
            Alert.alert('Select Provider', `Please select a ${serviceConfig.label.toLowerCase()} provider.`);
            return;
        }

        const missingRequirementMessage = getMissingRequirementMessage();
        if (missingRequirementMessage) {
            Alert.alert('Missing Information', missingRequirementMessage);
            return;
        }

        navigation.navigate('InternetPaymentSummary', {
            serviceKey: serviceConfig.key,
            serviceLabel: serviceConfig.label,
            provider: selectedProvider,
            formValues,
        });
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
                    <Ionicons name={item.icon as any} size={20} color="#666" />
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
                <Text style={styles.headerTitle}>{serviceConfig.label}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.iconContainer}>
                    <View style={styles.wifiCircle}>
                        <Ionicons name={serviceConfig.icon as any} size={32} color="#FF5252" />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>New Payment</Text>

                    <Text style={styles.label}>Select Provider</Text>
                    <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => setIsModalVisible(true)}
                    >
                        <View style={styles.dropdownLeft}>
                            <Ionicons name={serviceConfig.icon as any} size={20} color="#CCC" style={{ marginRight: 10 }} />
                            <Text style={[styles.dropdownText, !selectedProvider && { color: '#CCC' }]}>
                                {selectedProvider ? selectedProvider.name : `Choose ${serviceConfig.label.toLowerCase()} provider`}
                            </Text>
                        </View>
                        <Ionicons name="chevron-down" size={20} color="#666" />
                    </TouchableOpacity>

                    {serviceConfig.fields.map((field) => (
                        <View key={field.key} style={styles.fieldBlock}>
                            <Text style={styles.label}>{field.label}</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name={field.icon as any} size={20} color="#CCC" style={{ marginRight: 10 }} />
                                <TextInput
                                    style={styles.input}
                                    placeholder={field.placeholder}
                                    placeholderTextColor="#CCC"
                                    value={formValues[field.key] || ''}
                                    onChangeText={(value) => updateField(field.key, value)}
                                    keyboardType={field.keyboardType || 'default'}
                                />
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.continueButton, (!selectedProvider || hasMissingRequiredField()) && styles.continueButtonDisabled]}
                    onPress={handleContinue}
                    disabled={!selectedProvider || hasMissingRequiredField()}
                >
                    <Text style={[styles.continueText, (!selectedProvider || hasMissingRequiredField()) && styles.continueTextDisabled]}>
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
                            data={serviceConfig.providers}
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
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 10 },
    fieldBlock: { marginTop: 20 },
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
        backgroundColor: '#FFDB15',
        borderRadius: 30,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueButtonDisabled: { backgroundColor: '#F0F0F0' },
    continueText: { fontSize: 16, fontWeight: '700', color: '#000' },
    continueTextDisabled: { color: '#CCC' },
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
