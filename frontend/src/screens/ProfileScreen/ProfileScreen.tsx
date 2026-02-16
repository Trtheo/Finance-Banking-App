import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Modal, Switch, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as userService from '../../services/userService';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
    const navigation = useNavigation();
    const [isEditMode, setIsEditMode] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [loginFingerprint, setLoginFingerprint] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        city: '',
        language: 'English (US)',
        profileImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
    });

    const [tempData, setTempData] = useState({ ...profileData });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userService.getUserMe();
                const formattedData = {
                    name: data.fullName || data.name || '',
                    email: data.email || '',
                    phoneNumber: data.phone || data.phoneNumber || '',
                    dateOfBirth: data.dateOfBirth || 'Not set',
                    city: data.city || 'Not set',
                    language: data.language || 'English (US)',
                    profileImage: data.profileImage || profileData.profileImage
                };
                setProfileData(formattedData);
                setTempData(formattedData);
            } catch (error: any) {
                console.error('Error fetching profile:', error.message);
                // Don't alert here as it might be an auth issue handled elsewhere
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const languages = [
        { name: 'Chinese', flag: '🇨🇳' },
        { name: 'English (US)', flag: '🇺🇸' },
        { name: 'English (UK)', flag: '🇬🇧' },
        { name: 'French', flag: '🇫🇷' },
        { name: 'German', flag: '🇩🇪' },
        { name: 'Indonesian', flag: '🇮🇩' },
        { name: 'Japanese', flag: '🇯🇵' },
        { name: 'Korean', flag: '🇰🇷' },
        { name: 'Russian', flag: '🇷🇺' },
        { name: 'Spanish', flag: '🇪🇸' },
        { name: 'Thai', flag: '🇹🇭' },
        { name: 'Rwanda', flag: '🇷🇼' },
    ];

    const handleSave = async () => {
        try {
            setIsLoading(true);
            await userService.updateProfile({
                fullName: tempData.name,
                email: tempData.email,
                phone: tempData.phoneNumber,
                dateOfBirth: tempData.dateOfBirth,
                city: tempData.city,
                language: tempData.language
            });
            setProfileData({ ...tempData });
            setShowSuccessModal(true);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackPress = () => {
        if (isEditMode) {
            setShowExitModal(true);
        }
    };

    const handleCancelEdit = () => {
        setTempData({ ...profileData });
        setIsEditMode(false);
        setShowExitModal(false);
    };

    const handleLogout = () => {
        setShowExitModal(false);
        // @ts-ignore
        navigation.replace('Login');
    };

    if (isLoading && !isEditMode) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#FFD700" />
            </View>
        );
    }

    if (isEditMode) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBackPress} style={styles.headerIcon}>
                        <Ionicons name="chevron-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <View style={styles.headerIcon} />
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.profileImageContainer}>
                        <View style={styles.imageWrapper}>
                            <Image
                                source={{ uri: tempData.profileImage }}
                                style={styles.largeProfileImage}
                            />
                            <TouchableOpacity style={styles.editImageBadge}>
                                <Ionicons name="pencil" size={14} color="#333" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.formSection}>
                        <Text style={styles.label}>Name</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="#999" />
                            <TextInput
                                style={styles.input}
                                value={tempData.name}
                                onChangeText={(text) => setTempData({ ...tempData, name: text })}
                            />
                        </View>

                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#999" />
                            <TextInput
                                style={styles.input}
                                value={tempData.email}
                                onChangeText={(text) => setTempData({ ...tempData, email: text })}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <Text style={styles.label}>Phone Number</Text>
                        <View style={styles.inputContainer}>
                            <View style={styles.countryCodeContainer}>
                                <Text style={styles.flagSymbol}>🇺🇸</Text>
                                <Text style={styles.plusOne}>+1</Text>
                                <Ionicons name="chevron-down" size={14} color="#666" style={{ marginLeft: 4 }} />
                            </View>
                            <TextInput
                                style={styles.input}
                                value={tempData.phoneNumber}
                                onChangeText={(text) => setTempData({ ...tempData, phoneNumber: text })}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <Text style={styles.label}>Date of Birth</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="calendar-outline" size={20} color="#999" />
                            <TextInput
                                style={styles.input}
                                value={tempData.dateOfBirth}
                                onChangeText={(text) => setTempData({ ...tempData, dateOfBirth: text })}
                            />
                        </View>

                        <Text style={styles.label}>City of Residence</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="location-outline" size={20} color="#999" />
                            <TextInput
                                style={styles.input}
                                value={tempData.city}
                                onChangeText={(text) => setTempData({ ...tempData, city: text })}
                            />
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={handleBackPress}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <Modal visible={showSuccessModal} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.successIconCircle}>
                                <Ionicons name="checkmark" size={40} color="#FFD700" />
                            </View>
                            <Text style={styles.modalTitle}>Profile Update Successfully</Text>
                            <Text style={styles.modalSubtitle}>Congratulations! Your changes have been saved.{"\n"}Your profile is now up-to-date</Text>
                            <TouchableOpacity style={styles.fullWidthButton} onPress={() => { setShowSuccessModal(false); setIsEditMode(false); }}>
                                <Text style={styles.fullWidthButtonText}>Back to Profile</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal visible={showExitModal} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.warningIconCircle}>
                                <Ionicons name="alert" size={40} color="#FFD700" />
                            </View>
                            <Text style={styles.modalTitle}>Are you sure want to exit without saving your profile?</Text>
                            <Text style={styles.modalSubtitle}>If you exit now, any changes you haven't saved will be lost</Text>
                            <View style={styles.modalRow}>
                                <TouchableOpacity style={styles.halfWidthButtonOutline} onPress={() => setShowExitModal(false)}>
                                    <Text style={styles.halfWidthButtonTextOutline}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.halfWidthButton} onPress={handleCancelEdit}>
                                    <Text style={styles.halfWidthButtonText}>Yes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerIcon} />
                <Text style={styles.headerTitle}>My Profile</Text>
                <View style={styles.headerIcon} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <LinearGradient
                    colors={['#1c1c1c', '#000000']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.profileCard}
                >
                    <View style={styles.cardPattern} />
                    <Image
                        source={{ uri: profileData.profileImage }}
                        style={styles.profileAvatar}
                    />
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{profileData.name}</Text>
                        <Text style={styles.profileEmail}>{profileData.email}</Text>
                    </View>
                    <TouchableOpacity style={styles.cardEditButton} onPress={() => { setTempData({ ...profileData }); setIsEditMode(true); }}>
                        <Ionicons name="pencil" size={16} color="#333" />
                    </TouchableOpacity>
                </LinearGradient>

                <View style={styles.section}>
                    <Text style={styles.setSectionTitle}>Settings</Text>

                    <TouchableOpacity style={styles.menuItem} onPress={() => setShowLanguageModal(true)}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="language-outline" size={22} color="#666" />
                        </View>
                        <Text style={styles.menuText}>Language</Text>
                        <Text style={styles.menuValue}>{profileData.language}</Text>
                        <Ionicons name="chevron-forward" size={18} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => (navigation as any).navigate('NotificationSettings')}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="notifications-outline" size={22} color="#666" />
                        </View>
                        <Text style={styles.menuText}>Notification</Text>
                        <Ionicons name="chevron-forward" size={18} color="#999" />
                    </TouchableOpacity>

                    <View style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="moon-outline" size={22} color="#666" />
                        </View>
                        <Text style={styles.menuText}>Dark Mode</Text>
                        <Switch
                            value={darkMode}
                            onValueChange={setDarkMode}
                            trackColor={{ false: '#eee', true: '#FFD700' }}
                            thumbColor="#fff"
                        />
                    </View>
                </View>

                <View style={[styles.section, { marginTop: 20 }]}>
                    <Text style={styles.setSectionTitle}>Security</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="key-outline" size={22} color="#666" />
                        </View>
                        <Text style={styles.menuText}>Change PIN Number</Text>
                        <Ionicons name="chevron-forward" size={18} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => (navigation as any).navigate('ChangePassword')}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="lock-closed-outline" size={22} color="#666" />
                        </View>
                        <Text style={styles.menuText}>Change Password</Text>
                        <Ionicons name="chevron-forward" size={18} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="shield-checkmark-outline" size={22} color="#666" />
                        </View>
                        <Text style={styles.menuText}>Two Factor Authentication</Text>
                        <Ionicons name="chevron-forward" size={18} color="#999" />
                    </TouchableOpacity>

                    <View style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="finger-print-outline" size={22} color="#666" />
                        </View>
                        <Text style={styles.menuText}>Login Fingerprint</Text>
                        <Switch
                            value={loginFingerprint}
                            onValueChange={setLoginFingerprint}
                            trackColor={{ false: '#eee', true: '#FFD700' }}
                            thumbColor="#fff"
                        />
                    </View>
                </View>

                <View style={[styles.section, { marginTop: 20 }]}>
                    <Text style={styles.setSectionTitle}>Personal Information</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={styles.menuIconContainer}>
                                <Ionicons name="call-outline" size={22} color="#666" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Phone Number</Text>
                                <Text style={styles.infoValue}>+1 {profileData.phoneNumber}</Text>
                            </View>
                        </View>
                        <View style={styles.infoRow}>
                            <View style={styles.menuIconContainer}>
                                <Ionicons name="calendar-outline" size={22} color="#666" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Date of Birth</Text>
                                <Text style={styles.infoValue}>{profileData.dateOfBirth}</Text>
                            </View>
                        </View>
                        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                            <View style={styles.menuIconContainer}>
                                <Ionicons name="location-outline" size={22} color="#666" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>City of Residence</Text>
                                <Text style={styles.infoValue}>{profileData.city}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[styles.section, { marginTop: 20 }]}>
                    <Text style={styles.setSectionTitle}>Help Center</Text>

                    <TouchableOpacity style={styles.menuItem} onPress={() => (navigation as any).navigate('FAQ')}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="help-circle-outline" size={22} color="#666" />
                        </View>
                        <Text style={styles.menuText}>FAQ</Text>
                        <Ionicons name="chevron-forward" size={18} color="#999" />
                    </TouchableOpacity>
                </View>

                <View style={[styles.section, { marginTop: 20 }]}>
                    <Text style={styles.setSectionTitle}>Other</Text>

                    <TouchableOpacity style={styles.menuItem} onPress={() => setShowExitModal(true)}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="log-out-outline" size={22} color="#FF6B6B" />
                        </View>
                        <Text style={[styles.menuText, { color: '#FF6B6B' }]}>Logout</Text>
                        <Ionicons name="chevron-forward" size={18} color="#FF6B6B" />
                    </TouchableOpacity>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            <Modal visible={showExitModal && !isEditMode} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.warningIconCircle}>
                            <Ionicons name="log-out" size={40} color="#FFD700" />
                        </View>
                        <Text style={styles.modalTitle}>Are you sure want to Logout?</Text>
                        <Text style={styles.modalSubtitle}>You will need to login again to access your account</Text>
                        <View style={styles.modalRow}>
                            <TouchableOpacity style={styles.halfWidthButtonOutline} onPress={() => setShowExitModal(false)}>
                                <Text style={styles.halfWidthButtonTextOutline}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.halfWidthButton} onPress={handleLogout}>
                                <Text style={styles.halfWidthButtonText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={showLanguageModal} animationType="slide">
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setShowLanguageModal(false)} style={styles.headerIcon}>
                            <Ionicons name="chevron-back" size={24} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Select Language</Text>
                        <View style={styles.headerIcon} />
                    </View>

                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color="#999" />
                        <TextInput style={styles.searchPrompt} placeholder="Search" placeholderTextColor="#999" />
                    </View>

                    <ScrollView style={styles.languageSelectionList} showsVerticalScrollIndicator={false}>
                        {languages.map((lang, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.languageOption}
                                onPress={() => { setProfileData({ ...profileData, language: lang.name }); setShowLanguageModal(false); }}
                            >
                                <View style={styles.langInfo}>
                                    <Text style={styles.langFlag}>{lang.flag}</Text>
                                    <Text style={styles.langName}>{lang.name}</Text>
                                </View>
                                <View style={[styles.radioOuter, profileData.language === lang.name && styles.radioOuterSelected]}>
                                    {profileData.language === lang.name && <View style={styles.radioInner} />}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: 60,
        backgroundColor: '#fff',
    },
    headerIcon: {
        width: 40,
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    scrollView: {
        flex: 1,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000',
        marginHorizontal: 20,
        marginTop: 10,
        padding: 20,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
    },
    cardPattern: {
        position: 'absolute',
        right: -20,
        top: -20,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 215, 0, 0.05)',
    },
    profileAvatar: {
        width: 54,
        height: 54,
        borderRadius: 27,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    profileInfo: {
        flex: 1,
        marginLeft: 15,
    },
    profileName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 2,
    },
    profileEmail: {
        fontSize: 13,
        color: '#888',
    },
    cardEditButton: {
        backgroundColor: '#FFD700',
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    section: {
        marginTop: 25,
        paddingHorizontal: 20,
    },
    setSectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#888',
        marginBottom: 12,
        textTransform: 'capitalize',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 12,
        marginBottom: 2,
    },
    menuIconContainer: {
        width: 24,
        marginRight: 12,
    },
    menuText: {
        flex: 1,
        fontSize: 15,
        color: '#1a1a1a',
        fontWeight: '500',
    },
    menuValue: {
        fontSize: 14,
        color: '#999',
        marginRight: 8,
    },
    profileImageContainer: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    imageWrapper: {
        position: 'relative',
    },
    largeProfileImage: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#eee',
    },
    editImageBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#FFD700',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    formSection: {
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 8,
        marginTop: 18,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 52,
        backgroundColor: '#fafafa',
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#1a1a1a',
        marginLeft: 10,
    },
    countryCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#eee',
        paddingRight: 10,
        marginRight: 5,
    },
    flagSymbol: {
        fontSize: 18,
    },
    plusOne: {
        fontSize: 15,
        color: '#1a1a1a',
        marginLeft: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 35,
        gap: 15,
    },
    cancelButton: {
        flex: 1,
        height: 52,
        backgroundColor: '#fff',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    saveButton: {
        flex: 1,
        height: 52,
        backgroundColor: '#FFD700',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 30,
        width: '100%',
        alignItems: 'center',
    },
    successIconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    warningIconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: 10,
        lineHeight: 24,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 20,
    },
    fullWidthButton: {
        backgroundColor: '#FFD700',
        borderRadius: 12,
        height: 52,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullWidthButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    modalRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    halfWidthButtonOutline: {
        flex: 1,
        height: 52,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    halfWidthButtonTextOutline: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    halfWidthButton: {
        flex: 1,
        height: 52,
        backgroundColor: '#FFD700',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    halfWidthButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: 60,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        marginHorizontal: 20,
        marginTop: 10,
        paddingHorizontal: 15,
        height: 48,
        borderRadius: 12,
    },
    searchPrompt: {
        flex: 1,
        fontSize: 15,
        color: '#1a1a1a',
        marginLeft: 10,
    },
    languageSelectionList: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 20,
    },
    languageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
    },
    langInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    langFlag: {
        fontSize: 22,
        marginRight: 12,
    },
    langName: {
        fontSize: 15,
        color: '#1a1a1a',
        fontWeight: '500',
    },
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioOuterSelected: {
        borderColor: '#FFD700',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FFD700',
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 15,
        color: '#1a1a1a',
        fontWeight: '500',
    },
});
