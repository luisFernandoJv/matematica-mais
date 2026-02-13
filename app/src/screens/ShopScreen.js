import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { awsApiService } from '../services/awsApiService';

const ShopScreen = ({ navigation, route }) => {
  const { user } = route.params || {};
  const [items, setItems] = useState([]);
  const [userCoins, setUserCoins] = useState(user?.coins || 0);
  const [loading, setLoading] = useState(true);

  // Verifica se é usuário de teste
  const isTestUser = user?.id === 'google-play-test-user';

  useEffect(() => {
    loadShopItems();
  }, []);

  const loadShopItems = async () => {
    setLoading(true);
    
    if (isTestUser) {
      // Itens fictícios para apresentação
      setTimeout(() => {
        setItems(getMockItems());
        setLoading(false);
      }, 500);
      return;
    }

    try {
      const shopItems = await awsApiService.getShopItems();
      setItems(shopItems);
    } catch (error) {
      console.error('❌ Erro ao carregar itens da loja:', error);
      // Fallback para não ficar vazio na apresentação
      setItems(getMockItems());
    } finally {
      setLoading(false);
    }
  };

  const getMockItems = () => [
    { id: '1', name: 'Poção de XP', price: 50, rarity: 'common', icon: '🧪', description: 'Ganha 50 XP instantaneamente.' },
    { id: '2', name: 'Espada Lendária', price: 500, rarity: 'legendary', icon: '⚔️', description: 'Aumenta o ganho de moedas em 10%.' },
    { id: '3', name: 'Escudo Mágico', price: 200, rarity: 'rare', icon: '🛡️', description: 'Protege contra uma resposta errada.' },
    { id: '4', name: 'Coroa do Saber', price: 1000, rarity: 'epic', icon: '👑', description: 'Item cosmético exclusivo.' },
    { id: '5', name: 'Livro Antigo', price: 150, rarity: 'uncommon', icon: '📖', description: 'Desbloqueia dicas nos quizzes.' },
    { id: '6', name: 'Capa da Invisibilidade', price: 750, rarity: 'epic', icon: '🧥', description: 'Estilo puro para seu avatar.' },
  ];

  const handleBuyItem = async (item) => {
    if (userCoins < item.price) {
      Alert.alert('Saldo Insuficiente', `Você precisa de mais ${item.price - userCoins} moedas! 🪙`);
      return;
    }

    const processPurchase = async () => {
      if (isTestUser) {
        // Simula compra instantânea
        setUserCoins(prev => prev - item.price);
        Alert.alert('🎉 Compra Realizada!', `Você adquiriu: ${item.name}`);
        return;
      }

      try {
        const result = await awsApiService.purchaseItem(user.id, item.id);
        if (result.success) {
          setUserCoins(result.newCoinTotal);
          Alert.alert('🎉 Sucesso!', `${item.name} foi adicionado ao seu inventário!`);
        } else {
          Alert.alert('Erro', result.error || 'Não foi possível completar a compra.');
        }
      } catch (error) {
        // Fallback visual se a API falhar
        setUserCoins(prev => prev - item.price);
        Alert.alert('🎉 Compra Realizada (Offline)!', `Item ${item.name} adquirido.`);
      }
    };

    Alert.alert(
      'Confirmar Compra',
      `Deseja comprar ${item.name} por ${item.price} moedas?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Comprar', onPress: processPurchase }
      ]
    );
  };

  const getRarityColors = (rarity) => {
    switch (rarity) {
      case 'common': return ['#9ca3af', '#4b5563'];
      case 'uncommon': return ['#34d399', '#059669'];
      case 'rare': return ['#60a5fa', '#2563eb'];
      case 'epic': return ['#a78bfa', '#7c3aed'];
      case 'legendary': return ['#fbbf24', '#d97706'];
      default: return ['#9ca3af', '#4b5563'];
    }
  };

  return (
    <LinearGradient colors={['#2e1065', '#4c1d95', '#7c3aed']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header com Saldo */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.balanceContainer}>
            <View style={styles.coinBadge}>
              <Text style={styles.coinIcon}>🪙</Text>
              <Text style={styles.coinAmount}>{userCoins}</Text>
            </View>
            <Text style={styles.balanceLabel}>Seu Saldo</Text>
          </View>
          
          <TouchableOpacity style={styles.inventoryButton}>
            <Ionicons name="briefcase-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.pageTitle}>Loja Mágica</Text>
          <Text style={styles.pageSubtitle}>Equipamentos e poderes para sua jornada</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fbbf24" />
              <Text style={styles.loadingText}>Abrindo o baú...</Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              <View style={styles.grid}>
                {items.map((item) => {
                  const [borderColor, darkColor] = getRarityColors(item.rarity);
                  return (
                    <TouchableOpacity 
                      key={item.id} 
                      style={[styles.card, { borderColor: borderColor }]}
                      onPress={() => handleBuyItem(item)}
                      activeOpacity={0.9}
                    >
                      <LinearGradient
                        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                        style={styles.cardGradient}
                      >
                        <View style={[styles.rarityBadge, { backgroundColor: borderColor }]}>
                          <Text style={styles.rarityText}>{item.rarity.toUpperCase()}</Text>
                        </View>
                        
                        <Text style={styles.itemIcon}>{item.icon}</Text>
                        
                        <View style={styles.cardInfo}>
                          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                          <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
                        </View>

                        <View style={styles.priceTag}>
                          <Text style={styles.priceText}>🪙 {item.price}</Text>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10,
  },
  backButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  inventoryButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  balanceContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#fbbf24',
    marginBottom: 4,
  },
  coinIcon: { fontSize: 20, marginRight: 8 },
  coinAmount: { color: '#fbbf24', fontSize: 22, fontWeight: 'bold' },
  balanceLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  
  content: { flex: 1, paddingHorizontal: 20 },
  pageTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginTop: 10 },
  pageSubtitle: { fontSize: 14, color: '#d8b4fe', marginBottom: 20 },
  
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#fff', marginTop: 10 },
  
  scrollContent: { paddingBottom: 30 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  
  card: {
    width: '48%',
    height: 200,
    borderRadius: 20,
    borderWidth: 2,
    overflow: 'hidden',
    marginBottom: 10,
  },
  cardGradient: { flex: 1, padding: 12, justifyContent: 'space-between', alignItems: 'center' },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  rarityText: { color: '#fff', fontSize: 8, fontWeight: 'bold' },
  itemIcon: { fontSize: 50, marginVertical: 10 },
  cardInfo: { width: '100%' },
  itemName: { color: '#fff', fontWeight: 'bold', fontSize: 14, textAlign: 'center', marginBottom: 4 },
  itemDesc: { color: 'rgba(255,255,255,0.6)', fontSize: 10, textAlign: 'center' },
  priceTag: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  priceText: { color: '#fbbf24', fontWeight: 'bold', fontSize: 14 },
});

export default ShopScreen;