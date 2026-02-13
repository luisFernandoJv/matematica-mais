import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  ImageBackground
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// ✅ CORREÇÃO: Usando a biblioteca correta para evitar o Warning
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // Certifique-se de ter @expo/vector-icons instalado

import { awsApiService } from '../services/awsApiService';
import { authService } from '../services/authService';

const { width } = Dimensions.get('window');

const StudentDashboardScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(route.params?.user || {});
  const [worlds, setWorlds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verifica se é o usuário de teste para evitar chamadas de API (Erro 401)
  const isTestUser = user?.id === 'google-play-test-user';

  useEffect(() => {
    loadWorlds();
    handleCheckAuth();
  }, []);

  const handleCheckAuth = async () => {
    // ✅ CORREÇÃO: Se for usuário de teste, ignora verificação de token
    if (isTestUser) return;

    const isAuthenticated = await authService.checkAuth();
    if (!isAuthenticated) {
      Alert.alert('Sessão expirada', 'Por favor, faça login novamente.');
      navigation.replace('StudentLogin');
    }
  };

  const loadWorlds = async () => {
    setLoading(true);
    
    // ✅ CORREÇÃO: Se for teste, usa dados locais e NÃO chama a API
    if (isTestUser) {
      console.log('⚡ Modo Teste: Carregando mundos locais...');
      setWorlds(getDefaultWorlds());
      setLoading(false);
      return;
    }

    try {
      const worldsData = await awsApiService.getWorlds();
      setWorlds(worldsData);
    } catch (error) {
      console.error('❌ Erro ao carregar mundos (API):', error);
      // Fallback para dados locais em caso de erro real
      setWorlds(getDefaultWorlds());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultWorlds = () => [
    {
      id: 'math',
      name: 'Matemágica',
      description: 'Onde os números ganham vida!',
      icon: '📐',
      totalSubworlds: 5,
      completedSubworlds: 2,
      color: ['#3b82f6', '#1d4ed8']
    },
    {
      id: 'science',
      name: 'Ciências Encantadas',
      description: 'Descubra os segredos da natureza.',
      icon: '🧬',
      totalSubworlds: 5,
      completedSubworlds: 0,
      color: ['#10b981', '#047857']
    },
    {
      id: 'history',
      name: 'Guardiões do Tempo',
      description: 'Viaje pelas eras da história.',
      icon: '⏳',
      totalSubworlds: 5,
      completedSubworlds: 0,
      color: ['#f59e0b', '#b45309']
    }
  ];

  const handleStartAdventure = (world) => {
    navigation.navigate('WorldMap', { user, world });
  };

  const handleShop = () => navigation.navigate('Shop', { user });
  const handleMultiplayer = () => navigation.navigate('MultiplayerLobby', { user });
  const handleQuickQuiz = () => navigation.navigate('QuestionArea', { user, world: { id: 'default' } }); // Envia um mundo default para evitar erro na próxima tela

  const handleRanking = async () => {
    if (isTestUser) {
        navigation.navigate('Ranking', { ranking: [] });
        return;
    }
    try {
      const ranking = await awsApiService.getGlobalRanking();
      navigation.navigate('Ranking', { ranking });
    } catch (error) {
      navigation.navigate('Ranking', { ranking: [] });
    }
  };

  const handleLogout = () => {
    Alert.alert('Sair do Reino', 'Deseja realmente sair?', [
      { text: 'Ficar', style: 'cancel' },
      { 
        text: 'Sair', 
        style: 'destructive',
        onPress: async () => {
            if (!isTestUser) await authService.logout();
            navigation.replace('StudentLogin');
        }
      }
    ]);
  };

  const getLevelInfo = (xp = 0) => {
    const level = Math.floor(xp / 100) + 1;
    const currentLevelXP = xp % 100;
    return { level, currentLevelXP, xpForNextLevel: 100 };
  };

  const { level, currentLevelXP, xpForNextLevel } = getLevelInfo(user?.experience || 0);

  return (
    <LinearGradient colors={['#2e1065', '#4c1d95', '#7c3aed']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* === HERO SECTION (Perfil) === */}
          <View style={styles.heroCard}>
            <View style={styles.heroHeaderRow}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{user?.avatar || '🦁'}</Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>{level}</Text>
                </View>
              </View>
              
              <View style={styles.heroInfo}>
                <Text style={styles.greeting}>Olá, Herói!</Text>
                <Text style={styles.heroName} numberOfLines={1}>{user?.name || 'Aventureiro'}</Text>
                <Text style={styles.heroSchool} numberOfLines={1}>{user?.school || 'Escola Mágica'}</Text>
              </View>

              <View style={styles.walletContainer}>
                <View style={styles.coinBadge}>
                  <Text style={styles.coinIcon}>🪙</Text>
                  <Text style={styles.coinValue}>{user?.coins || 0}</Text>
                </View>
              </View>
            </View>

            {/* Barra de XP */}
            <View style={styles.xpSection}>
              <View style={styles.xpLabels}>
                <Text style={styles.xpLabelText}>Experiência</Text>
                <Text style={styles.xpValueText}>{currentLevelXP}/{xpForNextLevel} XP</Text>
              </View>
              <View style={styles.xpTrack}>
                <LinearGradient
                  colors={['#fbbf24', '#f59e0b']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.xpFill, { width: `${(currentLevelXP / xpForNextLevel) * 100}%` }]}
                />
              </View>
            </View>
          </View>

          {/* === ACTIONS GRID (Botões Grandes) === */}
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={handleQuickQuiz}>
              <LinearGradient colors={['#0ea5e9', '#0284c7']} style={styles.actionGradient}>
                <Text style={styles.actionEmoji}>⚡</Text>
                <Text style={styles.actionTitle}>Quiz Rápido</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleShop}>
              <LinearGradient colors={['#ec4899', '#db2777']} style={styles.actionGradient}>
                <Text style={styles.actionEmoji}>🛍️</Text>
                <Text style={styles.actionTitle}>Loja</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleMultiplayer}>
              <LinearGradient colors={['#8b5cf6', '#7c3aed']} style={styles.actionGradient}>
                <Text style={styles.actionEmoji}>⚔️</Text>
                <Text style={styles.actionTitle}>Batalha</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleRanking}>
              <LinearGradient colors={['#f59e0b', '#d97706']} style={styles.actionGradient}>
                <Text style={styles.actionEmoji}>🏆</Text>
                <Text style={styles.actionTitle}>Ranking</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* === WORLDS CAROUSEL === */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>🌍 Mapas Disponíveis</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.worldsScroll}>
              {worlds.map((world, index) => (
                <TouchableOpacity key={index} activeOpacity={0.9} onPress={() => handleStartAdventure(world)}>
                  <LinearGradient
                    colors={world.color || ['#4c1d95', '#6d28d9']}
                    style={styles.worldCard}
                  >
                    <Text style={styles.worldIcon}>{world.icon}</Text>
                    <Text style={styles.worldName}>{world.name}</Text>
                    <View style={styles.worldFooter}>
                        <Text style={styles.worldProgress}>
                            {world.completedSubworlds}/{world.totalSubworlds} Fases
                        </Text>
                        <Ionicons name="arrow-forward-circle" size={24} color="white" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Sair do Jogo</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  
  // Hero Card Styles
  heroCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 30,
    width: 64,
    height: 64,
    textAlign: 'center',
    lineHeight: 64,
    overflow: 'hidden',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#fbbf24',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4c1d95',
  },
  levelText: {
    fontWeight: 'bold',
    color: '#4c1d95',
    fontSize: 12,
  },
  heroInfo: {
    flex: 1,
  },
  greeting: {
    color: '#d8b4fe',
    fontSize: 14,
    fontWeight: '600',
  },
  heroName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  heroSchool: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  walletContainer: {
    justifyContent: 'center',
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  coinIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  coinValue: {
    color: '#fbbf24',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // XP Styles
  xpSection: {
    marginTop: 5,
  },
  xpLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  xpLabelText: {
    color: '#d8b4fe',
    fontSize: 12,
    fontWeight: '600',
  },
  xpValueText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  xpTrack: {
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    borderRadius: 5,
  },

  // Actions Grid Styles
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 30,
  },
  actionCard: {
    width: (width - 55) / 2, // Calcula largura para 2 colunas com margens
    height: 110,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  actionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  actionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Worlds Section Styles
  sectionContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginLeft: 5,
  },
  worldsScroll: {
    paddingRight: 20,
  },
  worldCard: {
    width: 220,
    height: 140,
    borderRadius: 20,
    marginRight: 15,
    padding: 20,
    justifyContent: 'space-between',
  },
  worldIcon: {
    fontSize: 32,
  },
  worldName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  worldFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  worldProgress: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
  },

  // Logout Button
  logoutButton: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  logoutText: {
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
  },
});

export default StudentDashboardScreen;