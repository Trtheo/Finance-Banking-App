import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { 
  Wifi, Zap, Droplets, Tv, Gamepad2, Receipt, ShoppingBag, Smartphone, 
  HeartPulse, Car, Bike, Building2, Wallet, TrendingUp, CreditCard, Gift, X,
  Phone, Home, Plane, GraduationCap, Baby, Coffee, Music, Film, Book, Dumbbell,
  Newspaper, Briefcase, ShoppingCart, Utensils, Bus, Train, Fuel, ParkingCircle
} from 'lucide-react-native';

interface BillItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface BillSection {
  title: string;
  data: BillItem[];
}

const MENU_DATA: BillSection[] = [
  {
    title: 'Payments',
    data: [
      { id: '1', label: 'Internet', icon: <Wifi size={24} color="#FFD700" /> },
      { id: '2', label: 'Electricity', icon: <Zap size={24} color="#FFD700" /> },
      { id: '3', label: 'Water', icon: <Droplets size={24} color="#FFD700" /> },
      { id: '4', label: 'Television', icon: <Tv size={24} color="#FFD700" /> },
      { id: '5', label: 'Games', icon: <Gamepad2 size={24} color="#FFD700" /> },
      { id: '6', label: 'Tax', icon: <Receipt size={24} color="#FFD700" /> },
      { id: '7', label: 'Lifestyle', icon: <ShoppingBag size={24} color="#FFD700" /> },
      { id: '8', label: 'VA Number', icon: <Smartphone size={24} color="#FFD700" /> },
      { id: '9', label: 'Phone Bill', icon: <Phone size={24} color="#FFD700" /> },
      { id: '10', label: 'Rent', icon: <Home size={24} color="#FFD700" /> },
      { id: '11', label: 'Travel', icon: <Plane size={24} color="#FFD700" /> },
      { id: '12', label: 'Education', icon: <GraduationCap size={24} color="#FFD700" /> },
      { id: '13', label: 'Newspaper', icon: <Newspaper size={24} color="#FFD700" /> },
      { id: '14', label: 'Office', icon: <Briefcase size={24} color="#FFD700" /> },
      { id: '15', label: 'Shopping', icon: <ShoppingCart size={24} color="#FFD700" /> },
      { id: '16', label: 'Restaurant', icon: <Utensils size={24} color="#FFD700" /> },
    ],
  },
  {
    title: 'Insurance',
    data: [
      { id: '17', label: 'Health', icon: <HeartPulse size={24} color="#FFD700" /> },
      { id: '18', label: 'Car', icon: <Car size={24} color="#FFD700" /> },
      { id: '19', label: 'Motorcycle', icon: <Bike size={24} color="#FFD700" /> },
      { id: '20', label: 'Property', icon: <Building2 size={24} color="#FFD700" /> },
    ],
  },
  {
    title: 'Transportation',
    data: [
      { id: '21', label: 'Bus', icon: <Bus size={24} color="#FFD700" /> },
      { id: '22', label: 'Train', icon: <Train size={24} color="#FFD700" /> },
      { id: '23', label: 'Fuel', icon: <Fuel size={24} color="#FFD700" /> },
      { id: '24', label: 'Parking', icon: <ParkingCircle size={24} color="#FFD700" /> },
    ],
  },
  {
    title: 'Entertainment',
    data: [
      { id: '25', label: 'Music', icon: <Music size={24} color="#FFD700" /> },
      { id: '26', label: 'Movies', icon: <Film size={24} color="#FFD700" /> },
      { id: '27', label: 'Books', icon: <Book size={24} color="#FFD700" /> },
      { id: '28', label: 'Gym', icon: <Dumbbell size={24} color="#FFD700" /> },
    ],
  },
  {
    title: 'Others',
    data: [
      { id: '29', label: 'Top Up', icon: <Wallet size={24} color="#FFD700" /> },
      { id: '30', label: 'Investment', icon: <TrendingUp size={24} color="#FFD700" /> },
      { id: '31', label: 'Credit', icon: <CreditCard size={24} color="#FFD700" /> },
      { id: '32', label: 'Donate', icon: <Gift size={24} color="#FFD700" /> },
      { id: '33', label: 'Childcare', icon: <Baby size={24} color="#FFD700" /> },
      { id: '34', label: 'Cafe', icon: <Coffee size={24} color="#FFD700" /> },
    ],
  },
];

export const PayBillsMenu = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Menu</Text>
            <TouchableOpacity onPress={onClose}>
              <X color="#000" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {MENU_DATA.map((section) => (
              <View key={section.title} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <View style={styles.grid}>
                  {section.data.map((item) => (
                    <TouchableOpacity key={item.id} style={styles.itemContainer}>
                      <View style={styles.iconCircle}>
                        {item.icon}
                      </View>
                      <Text style={styles.itemLabel}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheetContainer: { backgroundColor: '#FFF', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, height: '80%' },
  header: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20, position: 'relative' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#666', marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  itemContainer: { width: '25%', alignItems: 'center', marginBottom: 20 },
  iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  itemLabel: { fontSize: 11, color: '#333', textAlign: 'center' },
});
