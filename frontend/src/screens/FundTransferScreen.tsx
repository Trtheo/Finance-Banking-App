import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, 
  Image, TouchableOpacity, Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const TransferMethod = ({ icon, title, color, iconColor }: any) => (
  <TouchableOpacity style={styles.methodCard}>
    <View style={[styles.methodIcon, { backgroundColor: color }]}>
      <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
    </View>
    <Text style={styles.methodText}>{title}</Text>
    <Ionicons name="chevron-forward" size={20} color="#E0E0E0" />
  </TouchableOpacity>
);

const AvatarItem = ({ name, img }: any) => (
  <View style={styles.avatarContainer}>
    <Image source={{ uri: img }} style={styles.avatarImg} />
    <Text style={styles.avatarName}>{name}</Text>
  </View>
);

const FavoriteRow = ({ name, sub, img }: any) => (
  <View style={styles.favRow}>
    <Image source={{ uri: img }} style={styles.favImg} />
    <View style={{ flex: 1, marginLeft: 15 }}>
      <Text style={styles.favName}>{name}</Text>
      <Text style={styles.favSub}>{sub}</Text>
    </View>
    <MaterialCommunityIcons name="star" size={22} color="#FFDE31" />
  </View>
);

export default function FundTransferScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transfer</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.actionContainer}>
          <TransferMethod 
            icon="wallet-outline" 
            title="Nexpay Account" 
            color="#FFDE31" 
            iconColor="#000" 
          />
          <TransferMethod 
            icon="bank-outline" 
            title="Bank Account" 
            color="#FFF9DB" 
            iconColor="#FFDE31" 
          />
        </View>

        <View style={styles.whitePanel}>
          <Text style={styles.sectionTitle}>Latest Transfers</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.avatarList}>
            <AvatarItem name="Steven" img="https://i.pravatar.cc/150?u=1" />
            <AvatarItem name="Hana" img="https://i.pravatar.cc/150?u=2" />
            <AvatarItem name="Tom" img="https://i.pravatar.cc/150?u=3" />
            <AvatarItem name="Lisa" img="https://i.pravatar.cc/150?u=4" />
            <AvatarItem name="Bruno" img="https://i.pravatar.cc/150?u=5" />
          </ScrollView>

          <View style={styles.favHeader}>
            <Text style={styles.sectionTitle}>Favorite Lists</Text>
            <TouchableOpacity><Text style={styles.viewAllText}>View all</Text></TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#BDBDBD" />
            <TextInput placeholder="Search" style={styles.searchInput} placeholderTextColor="#BDBDBD" />
          </View>

          <FavoriteRow name="Ethan Reynolds" sub="Nexpay • 0743523736" img="https://i.pravatar.cc/150?u=8" />
          <FavoriteRow name="Sophia Bennett" sub="Bank BRI • 108934623804" img="https://i.pravatar.cc/150?u=9" />
          
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9F9F9' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, height: 60 },
  backBtn: { width: 40 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scrollContent: { paddingTop: 10 },
  actionContainer: { paddingHorizontal: 20, marginBottom: 25 },
  methodCard: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', 
    padding: 15, borderRadius: 20, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 
  },
  methodIcon: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  methodText: { flex: 1, marginLeft: 15, fontSize: 16, fontWeight: '600' },
  whitePanel: { 
    backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, 
    padding: 25, flex: 1, minHeight: 600 
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15 },
  avatarList: { marginBottom: 25 },
  avatarContainer: { alignItems: 'center', marginRight: 20 },
  avatarImg: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#EEE' },
  avatarName: { marginTop: 8, fontSize: 13, color: '#4F4F4F' },
  favHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAllText: { color: '#BDBDBD', fontSize: 14 },
  searchContainer: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8F8', 
    borderRadius: 25, paddingHorizontal: 15, height: 50, marginVertical: 15,
    borderWidth: 1, borderColor: '#F0F0F0'
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  favRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  favImg: { width: 50, height: 50, borderRadius: 25 },
  favName: { fontSize: 16, fontWeight: '600' },
  favSub: { fontSize: 12, color: '#BDBDBD', marginTop: 2 },
});
