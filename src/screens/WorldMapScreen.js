import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { awsApiService } from '../services/awsApiService';

const WorldMapScreen = ({ navigation, route }) => {
  const { user } = route.params || {};
  const [worlds, setWorlds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verifica se é usuário de teste
  const isTestUser = user?.id === 'google-play-test-user';

  useEffect(() => {
    loadWorldsAndProgress();
  }, []);

  const loadWorldsAndProgress = async () => {
    setLoading(true);

    if (isTestUser) {
      // Dados simulados para o testador
      const mockWorlds = getMockWorlds();
      const worldsWithProgress = mockWorlds.map(world => ({
        ...world,
        unlocked: (user?.level || 1) >= (world.requiredLevel || 1),
        progress: { completedLevels: 2, totalLevels: 5 } // Simula progresso
      }));
      setWorlds(worldsWithProgress);
      setLoading(false);
      return;
    }

    try {
      const worldsData = await awsApiService.getWorlds();
      // Em produção real, você buscaria o progresso aqui
      const worldsWithProgress = worldsData.map(world => ({
        ...world,
        unlocked: (user?.level || 1) >= (world.requiredLevel || 1),
        progress: { completedLevels: 0, totalLevels: world.totalLevels || 5 }
      }));

      setWorlds(worldsWithProgress);
    } catch (error) {
      console.error('Erro ao carregar mundos:', error);
      // Fallback
      setWorlds(getMockWorlds().map(w => ({ ...w, unlocked: true, progress: {completedLevels:0, totalLevels:5} })));
    } finally {
      setLoading(false);
    }
  };

  const getMockWorlds = () => [
    {
      id: 'math',
      name: 'Reino da Matemágica',
      description: 'Domine os números antigos.',
      icon: 'calculator',
      requiredLevel: 1,
      difficulty: 'Fácil',
      color: ['#3b82f6', '#1d4ed8']
    },
    {
      id: 'science',
      name: 'Floresta da Ciência',
      description: 'Explore a biologia e física.',
      icon: 'flask',
      requiredLevel: 3,
      difficulty: 'Médio',
      color: ['#10b981', '#047857']
    },
    {
      id: 'history',
      name: 'Ruínas do Tempo',
      description: 'Descubra civilizações perdidas.',
      icon: 'hourglass',
      requiredLevel: 5,
      difficulty: 'Difícil',
      color: ['#f59e0b', '#b45309']
    },
    {
        id: 'geo',
        name: 'Picos Geográficos',
        description: 'Escale as montanhas do saber.',
        icon: 'earth',
        requiredLevel: 10,
        difficulty: 'Lendário',
        color: ['#8b5cf6', '#5b21b6']
    }
  ];

  const handleWorldSelect = (world) => {
    if (!world.unlocked) {
      Alert.alert(
        "Mundo Bloqueado 🔒",
        `Você precisa alcançar o nível ${world.requiredLevel} para entrar neste reino!`,
        [{ text: "Continuar Treinando" }]
      );
      return;
    }

    navigation.navigate('LevelSelection', {
      world: world,
      user: user
    });
  };

  const renderWorldCard = (world) => {
    const isUnlocked = world.unlocked;
    const progressPercent = (world.progress.completedLevels / world.progress.totalLevels) * 100;
    const colors = isUnlocked ? world.color : ['#4b5563', '#1f2937'];

    return (
      <TouchableOpacity
        key={world.id}
        onPress={() => handleWorldSelect(world)}
        activeOpacity={0.9}
        style={styles.cardContainer}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.cardGradient}
        >
          <View style={styles.cardLeft}>
            <View style={[styles.iconBox, { backgroundColor: isUnlocked ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)' }]}>
              <Ionicons name={world.icon} size={32} color={isUnlocked ? "#fff" : "#9ca3af"} />
            </View>
          </View>

          <View style={styles.cardCenter}>
            <Text style={[styles.worldName, !isUnlocked && styles.textLocked]}>
              {world.name}
            </Text>
            <Text style={styles.worldDesc} numberOfLines={1}>
              {isUnlocked ? world.description : `Nível ${world.requiredLevel} necessário`}
            </Text>
            
            {isUnlocked && (
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
              </View>
            )}
          </View>

          <View style={styles.cardRight}>
            {isUnlocked ? (
               <View style={styles.playButton}>
                 <Ionicons name="play" size={20} color={colors[1]} />
               </View>
            ) : (
               <Ionicons name="lock-closed" size={24} color="#9ca3af" />
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#1e1b4b', '#312e81', '#4338ca']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
             <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Mapa Mundi</Text>
            <Text style={styles.headerSubtitle}>Escolha seu destino</Text>
          </View>
          <View style={styles.userLevelBadge}>
             <Text style={styles.levelText}>{user?.level || 1}</Text>
             <Text style={styles.levelLabel}>Nível</Text>
          </View>
        </View>

        {loading ? (
           <View style={styles.loadingContainer}>
             <ActivityIndicator size="large" color="#fff" />
           </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {worlds.map(renderWorldCard)}
          </ScrollView>
        )}

      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  titleContainer: { alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 12, color: '#a5b4fc' },
  userLevelBadge: {
    backgroundColor: '#fbbf24',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
  },
  levelText: { fontWeight: 'bold', color: '#4c1d95', fontSize: 16 },
  levelLabel: { fontSize: 8, color: '#4c1d95', fontWeight: '600' },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20 },

  cardContainer: {
    height: 100,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 4},
  },
  cardGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cardLeft: { marginRight: 15 },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardCenter: { flex: 1 },
  worldName: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  textLocked: { color: '#d1d5db' },
  worldDesc: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 8 },
  
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 3,
    width: '90%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },

  cardRight: { marginLeft: 10 },
  playButton: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WorldMapScreen;