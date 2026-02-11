import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Dimensions, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as transactionService from '../services/transactionService';

const { width } = Dimensions.get('window');

export default function FundTransferScreen({ navigation }: any) {
  const [recipientAccount, setRecipientAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTransfer = async () => {
    if (!recipientAccount || !amount) {
      Alert.alert('Error', 'Please enter recipient account and amount');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      setIsLoading(true);
      await transactionService.transfer(recipientAccount, numAmount, description);

      Alert.alert('Success', `Successfully transferred RWF ${numAmount.toLocaleString()} to ${recipientAccount}`, [
        { text: 'OK', onPress: () => navigation.navigate('Main') }
      ]);
    } catch (error: any) {
      Alert.alert('Transfer Failed', error.response?.data?.message || error.message || 'An error occurred during transfer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send Money</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Recipient Account Number</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. 1234567890"
              value={recipientAccount}
              onChangeText={setRecipientAccount}
              keyboardType="number-pad"
            />
          </View>

          <Text style={styles.label}>Amount (RWF)</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="cash-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="number-pad"
            />
          </View>

          <Text style={styles.label}>Description (Optional)</Text>
          <View style={[styles.inputContainer, { height: 100, alignItems: 'flex-start' }]}>
            <Ionicons name="chatbubble-outline" size={20} color="#666" style={[styles.icon, { marginTop: 12 }]} />
            <TextInput
              style={[styles.input, { height: '100%', textAlignVertical: 'top' }]}
              placeholder="What is this for?"
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          <TouchableOpacity
            style={[styles.transferButton, isLoading && { opacity: 0.7 }]}
            onPress={handleTransfer}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.transferButtonText}>Confirm Transfer</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Ionicons name="information-circle-outline" size={20} color="#888" />
          <Text style={styles.infoText}>
            Transfers between Nexpay accounts are instant and free. Please verify the recipient's account number before confirming.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9F9F9' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 15, height: 60
  },
  backBtn: { width: 40 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scrollContent: { padding: 20 },
  formContainer: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3
  },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 15 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16, color: '#000' },
  icon: { marginRight: 5 },
  transferButton: {
    backgroundColor: '#FFDE31',
    borderRadius: 15,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    elevation: 2
  },
  transferButtonText: { fontSize: 16, fontWeight: '700', color: '#000' },
  infoSection: {
    flexDirection: 'row',
    marginTop: 25,
    paddingHorizontal: 10,
    alignItems: 'flex-start'
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: '#888',
    lineHeight: 18
  }
});
