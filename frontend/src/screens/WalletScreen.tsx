import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function WalletScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Cards</Text>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.cardSection}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardLabel}>Platinum Card</Text>
                        <Ionicons name="arrow-forward" size={20} color="#000" />
                    </View>
                    <LinearGradient colors={['#2C2C2C', '#1A1A1A']} style={styles.card}>
                        <View style={styles.cardTop}>
                            <Text style={styles.cardBrand}>Nexpay</Text>
                            <View style={styles.chipIcon} />
                        </View>
                        <Text style={styles.cardNumber}>•••• •••• •••• 3014</Text>
                        <Text style={styles.cardBalance}>$317,286.00</Text>
                        <View style={styles.cardBottom}>
                            <View>
                                <Text style={styles.cardLabel2}>Card holder name</Text>
                                <Text style={styles.cardInfo}>Michael John</Text>
                            </View>
                            <View>
                                <Text style={styles.cardLabel2}>Expiry date</Text>
                                <Text style={styles.cardInfo}>03/29</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cardSection}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardLabel}>Gold Card</Text>
                        <Ionicons name="arrow-forward" size={20} color="#000" />
                    </View>
                    <LinearGradient colors={['#D4AF37', '#B8941F', '#8B7355']} style={styles.card}>
                        <View style={styles.cardTop}>
                            <Text style={styles.cardBrand}>Nexpay</Text>
                            <Text style={styles.visaLogo}>VISA</Text>
                        </View>
                        <Text style={styles.cardNumber}>•••• •••• •••• 8762</Text>
                        <Text style={styles.cardBalance}>$72,952.84</Text>
                        <View style={styles.cardBottom}>
                            <View>
                                <Text style={styles.cardLabel2}>Card holder name</Text>
                                <Text style={styles.cardInfo}>Michael John</Text>
                            </View>
                            <View>
                                <Text style={styles.cardLabel2}>Expiry date</Text>
                                <Text style={styles.cardInfo}>07/28</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.addButton}>
                    <Ionicons name="add" size={20} color="#000" />
                    <Text style={styles.addButtonText}>Add New Card</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    cardSection: {
        marginBottom: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    card: {
        borderRadius: 16,
        padding: 20,
        height: 200,
        justifyContent: 'space-between',
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardBrand: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFF',
    },
    chipIcon: {
        width: 40,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 6,
    },
    visaLogo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        fontStyle: 'italic',
    },
    cardNumber: {
        fontSize: 18,
        color: '#FFF',
        letterSpacing: 2,
        marginTop: 10,
    },
    cardBalance: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 5,
    },
    cardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    cardLabel2: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 4,
    },
    cardInfo: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFF',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        marginBottom: 30,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginLeft: 8,
    },
});
