import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function FAQScreen({ navigation }: any) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const categories = [
        { icon: 'grid-outline', label: 'General' },
        { icon: 'person-outline', label: 'Account' },
        { icon: 'card-outline', label: 'Cards' },
        { icon: 'shield-checkmark-outline', label: 'Security' },
        { icon: 'apps-outline', label: 'Apps' },
    ];

    const faqs = [
        {
            question: 'How do I reset my password?',
            answer: 'To reset your password, tap "Forgot Password" on the login screen. Follow the steps to verify your identity via SMS or email, then create a new password.'
        },
        {
            question: 'Why was my transaction declined?',
            answer: 'Transactions can be declined for various reasons including insufficient funds, incorrect card details, or security restrictions. Please check your account balance and card information.'
        },
        {
            question: 'Why am I not receiving the OTP code?',
            answer: 'Make sure your phone number is correct and you have good network coverage. OTP codes are usually delivered within 60 seconds. If you still don\'t receive it, try requesting a new code.'
        },
        {
            question: 'How do I report a lost or stolen card?',
            answer: 'Immediately contact our customer support or use the app to freeze your card. Go to Cards section, select the card, and tap "Report Lost/Stolen" to block it instantly.'
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>FAQ</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.searchSection}>
                    <Text style={styles.searchTitle}>Search for your answer here</Text>
                    <Text style={styles.searchSubtitle}>Need help? Start typing to find quick answers</Text>
                    
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color="#999" />
                        <TextInput 
                            style={styles.searchInput} 
                            placeholder="Search questions"
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>

                <View style={styles.categoriesSection}>
                    <Text style={styles.sectionTitle}>Topics by Category</Text>
                    <View style={styles.categoriesGrid}>
                        {categories.map((category, index) => (
                            <TouchableOpacity key={index} style={styles.categoryItem}>
                                <View style={styles.categoryIcon}>
                                    <Ionicons name={category.icon as any} size={24} color="#FFD700" />
                                </View>
                                <Text style={styles.categoryLabel}>{category.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.questionsSection}>
                    <Text style={styles.sectionTitle}>Top Questions</Text>
                    {faqs.map((faq, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.faqItem}
                            onPress={() => setExpandedIndex(expandedIndex === index ? null : index)}
                        >
                            <View style={styles.faqHeader}>
                                <Text style={styles.faqQuestion}>{faq.question}</Text>
                                <Ionicons 
                                    name={expandedIndex === index ? "chevron-up" : "chevron-down"} 
                                    size={20} 
                                    color="#666" 
                                />
                            </View>
                            {expandedIndex === index && (
                                <Text style={styles.faqAnswer}>{faq.answer}</Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    scrollView: {
        flex: 1,
    },
    searchSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    searchTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    searchSubtitle: {
        fontSize: 13,
        color: '#999',
        marginBottom: 15,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        marginLeft: 10,
    },
    categoriesSection: {
        paddingHorizontal: 20,
        paddingTop: 25,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
    },
    categoryItem: {
        alignItems: 'center',
        width: '18%',
    },
    categoryIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    categoryLabel: {
        fontSize: 11,
        color: '#666',
        textAlign: 'center',
    },
    questionsSection: {
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 30,
    },
    faqItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    faqQuestion: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
        marginRight: 10,
    },
    faqAnswer: {
        fontSize: 14,
        color: '#666',
        marginTop: 10,
        lineHeight: 20,
    },
});
