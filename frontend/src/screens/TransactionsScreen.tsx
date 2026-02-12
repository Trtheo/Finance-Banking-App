import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const TransactionItem = ({ item }: any) => {
  const isIncome = item.type === 'Deposit';
  
  return (
    <View style={styles.itemRow}>
      <View style={styles.iconContainer}>
        {item.type === 'Deposit' && <Ionicons name="arrow-down" size={20} color="#27AE60" />}
        {item.type === 'Withdrawal' && <Ionicons name="arrow-up" size={20} color="#E74C3C" />}
        {item.type === 'Internet Payment' && <Ionicons name="card-outline" size={20} color="#E74C3C" />}
      </View>
      <View style={styles.details}>
        <Text style={styles.itemName}>{item.description || item.type}</Text>
        <Text style={styles.itemDate}>{new Date(item.date).toLocaleString()}</Text>
      </View>
      <Text style={[styles.amount, { color: isIncome ? '#27AE60' : '#E74C3C' }]}>
        {isIncome ? '+' : '-'}${item.amount.toFixed(2)}
      </Text>
    </View>
  );
};

export default function TransactionsScreen({ navigation }: any) {
  const [filter, setFilter] = useState('All');
  const [sections, setSections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const storedTransactions = await AsyncStorage.getItem('internetPayments');
      const transactions = storedTransactions ? JSON.parse(storedTransactions) : [];

      // Group by date
      const groups = transactions.reduce((acc: any, tx: any) => {
        const date = new Date(tx.date).toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        if (!acc[date]) acc[date] = [];
        acc[date].push(tx);
        return acc;
      }, {});

      const sectionData = Object.keys(groups).map(date => ({
        title: date,
        data: groups[date]
      }));

      setSections(sectionData);
    } catch (error: any) {
      console.error('Error fetching transactions:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchTransactions();
    }, [])
  );

  const filteredSections = sections.map(section => ({
    ...section,
    data: section.data.filter((tx: any) => {
      if (filter === 'All') return true;
      const isIncome = tx.type === 'Deposit';
      if (filter === 'Income') return isIncome;
      if (filter === 'Expense') return !isIncome;
      return true;
    })
  })).filter(section => section.data.length > 0);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
        <ActivityIndicator size="large" color="#FFDE31" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Transactions</Text>
        <Ionicons name="search" size={24} color="black" />
      </View>

      <View style={styles.filterContainer}>
        {['All', 'Income', 'Expense'].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setFilter(item)}
            style={[styles.filterBtn, filter === item && styles.filterBtnActive]}
          >
            <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionList
        sections={filteredSections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem item={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>No transactions found</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20, marginVertical: 10 },
  filterBtn: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25, borderWidth: 1, borderColor: '#F0F0F0' },
  filterBtnActive: { backgroundColor: '#FFDE31', borderColor: '#FFDE31' },
  filterText: { fontWeight: '600', color: '#828282' },
  filterTextActive: { color: '#000' },
  subFilterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 20 },
  filterLabel: { fontSize: 16, fontWeight: '700' },
  dropdown: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', padding: 8, borderRadius: 15, borderWidth: 1, borderColor: '#F0F0F0' },
  dropdownText: { marginRight: 5, fontSize: 13 },
  sectionHeader: { fontSize: 14, color: '#BDBDBD', paddingHorizontal: 20, marginTop: 25, marginBottom: 15 },
  listContent: { paddingBottom: 40 },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  iconContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FDFDFD', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F5F5F5' },
  details: { flex: 1, marginLeft: 15 },
  itemName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  itemDate: { fontSize: 12, color: '#BDBDBD' },
  amount: { fontSize: 16, fontWeight: '700' },
  avatarPlaceholder: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#EEE' }
});
