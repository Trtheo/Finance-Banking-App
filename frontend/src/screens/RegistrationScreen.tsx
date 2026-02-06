import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Modal,
    FlatList,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const RWANDA_BANKS = [
    { id: 'bk', name: 'Bank of Kigali (BK)' },
    { id: 'equity_rw', name: 'Equity Bank Rwanda' },
    { id: 'im_rw', name: 'I&M Bank Rwanda' },
    { id: 'bpr', name: 'BPR Bank Rwanda' },
    { id: 'centenary', name: 'Centenary Bank' },
    { id: 'urwego', name: 'Urwego Bank' },
    { id: 'ecobank', name: 'Ecobank Rwanda' },
    { id: 'cogebanque', name: 'Cogebanque' },
];

// @ts-ignore
export default function RegistrationScreen({ navigation }) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [selectedBank, setSelectedBank] = useState<null | typeof RWANDA_BANKS[0]>(null);
    const [isBankModalVisible, setIsBankModalVisible] = useState(false);

    const handleRegister = () => {
        if (!fullName || !email || !phoneNumber || !selectedBank || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        console.log('Registering with:', {
            fullName,
            email,
            phoneNumber,
            password,
            bank: selectedBank.name
        });

        // TODO: Implement API call
        navigation.navigate('Login');
    };

    const renderBankItem = ({ item }: { item: typeof RWANDA_BANKS[0] }) => (
        <TouchableOpacity
            style={styles.bankItem}
            onPress={() => {
                setSelectedBank(item);
                setIsBankModalVisible(false);
            }}
        >
            <Ionicons name="business-outline" size={24} color="#666" style={styles.bankIcon} />
            <Text style={styles.bankName}>{item.name}</Text>
            {selectedBank?.id === item.id && (
                <Ionicons name="checkmark-circle" size={24} color="#FFD700" />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.logoText}>Nexpay</Text>
                        <Text style={styles.title}>Create Your Account</Text>
                        <Text style={styles.subtitle}>Smart and simple banking starts here</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.label}>Name</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="full names"
                                value={fullName}
                                onChangeText={setFullName}
                            />
                        </View>

                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Your Email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <Text style={styles.label}>Phone Number</Text>
                        <View style={styles.inputContainer}>
                            <View style={styles.flagContainer}>
                                <Text style={styles.flagText}>🇷🇼 +250</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="788 123 456"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <Text style={styles.label}>Select Bank</Text>
                        <TouchableOpacity
                            style={styles.pickerButton}
                            onPress={() => setIsBankModalVisible(true)}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="business-outline" size={20} color="#666" style={styles.icon} />
                                <Text style={[styles.pickerText, !selectedBank && { color: '#999' }]}>
                                    {selectedBank ? selectedBank.name : 'Select your bank'}
                                </Text>
                            </View>
                            <Ionicons name="chevron-down-outline" size={20} color="#666" />
                        </TouchableOpacity>


                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="key-outline" size={20} color="#666" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••••"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Confirm Password</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="key-outline" size={20} color="#666" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••••"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <Ionicons
                                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                            <Text style={styles.registerButtonText}>Register</Text>
                        </TouchableOpacity>

                        <View style={styles.dividerContainer}>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>Or</Text>
                            <View style={styles.divider} />
                        </View>

                        <TouchableOpacity style={styles.googleButton}>
                            <Ionicons name="logo-google" size={20} color="#EA4335" style={{ marginRight: 10 }} />
                            <Text style={styles.googleButtonText}>Register with Google</Text>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginText}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Bank Selection Modal */}
            <Modal
                visible={isBankModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsBankModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Bank</Text>
                            <TouchableOpacity onPress={() => setIsBankModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={RWANDA_BANKS}
                            keyExtractor={(item) => item.id}
                            renderItem={renderBankItem}
                            contentContainerStyle={styles.bankList}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
    },
    header: {
        marginBottom: 30,
    },
    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFD700', // Gold/Yellow color from image
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
        marginTop: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEE',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#EEE',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    pickerText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    icon: {
        marginRight: 5,
    },
    flagContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#EEE',
        paddingRight: 10,
        marginRight: 5,
    },
    flagText: {
        fontSize: 16,
    },
    registerButton: {
        backgroundColor: '#FFD700',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 30,
    },
    registerButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#EEE',
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#888',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#EEE',
        borderRadius: 10,
        paddingVertical: 15,
        backgroundColor: '#fff',
    },
    googleButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        color: '#888',
    },
    loginText: {
        color: '#333',
        fontWeight: 'bold',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '70%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    bankList: {
        padding: 20,
    },
    bankItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    bankIcon: {
        marginRight: 15,
    },
    bankName: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    }
});
