import React, { useState } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const DATA = [
  {
    title: "Today",
    data: [
      { id: '1', name: 'Apple services', date: '17 / 02 / 2025 • 10:32', amount: '- $50.00', type: 'expense', icon: 'apple' },
      { id: '2', name: 'Transfer to Sam', date: '17 / 02 / 2025 • 15:28', amount: '- $200.00', type: 'expense', icon: 'arrow-up' },
    ],
  },
  {
    title: "10 February 2025",
    data: [
      { id: '3', name: 'Withdraw from Paypal', date: '10 / 02 / 2025 • 13:54', amount: '+ $120.00', type: 'income', icon: 'paypal' },
      { id: '4', name: 'Lisa requested payment', date: '10 / 02 / 2025 • 11:28', amount: '- $72.00', type: 'expense', isUser: true },
      { id: '5', name: 'Transfer to Hana', date: '10 / 02 / 2025 • 09:32', amount: '- $18.00', type: 'expense', icon: 'arrow-up' },
    ],
  },
];

const TransactionItem = ({ item }: any) => (
  <View style={styles.itemRow}>
    <View style={styles.iconContainer}>
      {item.icon === 'apple' && <FontAwesome5 name="apple" size={20} color="black" />}
      {item.icon === 'paypal' && <FontAwesome5 name="paypal" size={20} color="black" />}
      {item.icon === 'arrow-up' && <Ionicons name="arrow-up" size={20} color="black" />}
      {item.isUser && <View style={styles.avatarPlaceholder} />}
    </View>
    <View style={styles.details}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDate}>{item.date}</Text>
    </View>
    <Text style={[styles.amount, { color: item.type === 'income' ? '#27AE60' : '#000' }]}>
      {item.amount}
    </Text>
  </View>
);

export default function TransactionsScreen({ navigation }: any) {
  const [filter, setFilter] = useState('All');

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

      <View style={styles.subFilterRow}>
        <Text style={styles.filterLabel}>Filter</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Last 30 Days</Text>
          <Ionicons name="chevron-down" size={16} color="black" />
        </TouchableOpacity>
      </View>

      <SectionList
        sections={DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem item={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
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
