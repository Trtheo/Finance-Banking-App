import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Dimensions, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import * as transactionService from '../../services/transactionService';
import * as cardService from '../../services/cardService';

const { width } = Dimensions.get('window');

export default function FundTransferScreen({ navigation }: any) {
  const [recipientAccount, setRecipientAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [cards, setCards] = useState<any[]>([]);
  const [selectedCardId, setSelectedCardId] = useState('');
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadCards = useCallback(async () => {
    try {
      setIsLoadingCards(true);
      const apiCards = await cardService.getCards();
      const cardsList = Array.isArray(apiCards) ? apiCards : [];
      setCards(cardsList);

      if (cardsList.length > 0) {
        const defaultCard = cardsList.find((card: any) => card.isDefault) || cardsList[0];
        setSelectedCardId(defaultCard?._id || '');
      } else {
        setSelectedCardId('');
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to load cards');
    } finally {
      setIsLoadingCards(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCards();
    }, [loadCards])
  );

  const cardLabel = (card: any) => {
    const suffix = String(card.cardNumber || '').slice(-4) || '0000';
    const tier = (card.cardTier || 'PLATINUM').toUpperCase();
    return `${tier} ••••${suffix}`;
  };

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

    if (cards.length === 0) {
      Alert.alert('No Card', 'You need at least one card to make a transfer.');
      return;
    }

    if (!selectedCardId) {
      Alert.alert('Select Card', 'Please select a card to use for this transfer.');
      return;
    }

    try {
      setIsLoading(true);
      await transactionService.transfer(
        recipientAccount.trim(),
        numAmount,
        description.trim() || undefined,
        selectedCardId
      );

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

          {isLoadingCards ? (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Transfer From</Text>
              <ActivityIndicator size="small" color="#FFDE31" />
            </View>
          ) : cards.length > 1 ? (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Transfer From Card</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedCardId}
                  onValueChange={(itemValue) => setSelectedCardId(itemValue)}
                >
                  {cards.map((card: any) => (
                    <Picker.Item
                      key={card._id}
                      label={cardLabel(card)}
                      value={card._id}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          ) : cards.length === 1 ? (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Transfer From Card</Text>
              <View style={styles.readOnlyCardBox}>
                <Text style={styles.readOnlyCardText}>{cardLabel(cards[0])}</Text>
              </View>
            </View>
          ) : null}

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
            Transfers between Nexpay accounts are instant and free. Maximum transfer per card is RWF 5,000,000.
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 15,
    backgroundColor: '#F8F8F8',
  },
  readOnlyCardBox: {
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 15,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 15,
    paddingVertical: 16,
  },
  readOnlyCardText: {
    fontSize: 16,
    color: '#333',
  },
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
