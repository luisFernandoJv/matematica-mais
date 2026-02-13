// src/screens/LevelSelectionScreen.js
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
// ✅ CORREÇÃO: Importar de 'awsApiService'
import { awsApiService } from '../services/awsApiService';

const LevelSelectionScreen = ({ navigation, route }) => {
  const { world, user } = route.params || {};
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLevels();
  }, []);

  const loadLevels = async () => {
    try {
      setLoading(true);
      // ✅ CORREÇÃO: Usar 'awsApiService.getQuestions' e simular níveis
      // Nota: o 'awsApiService' não tem 'getLevelsByWorld'.
      // Vamos buscar as questões e agrupar por nível.
      const questionsData = await awsApiService.getQuestions(world.id);
      
      if (!questionsData || questionsData.length === 0) {
        setLevels([]);
        throw new Error('Nenhuma questão encontrada para este mundo.');
      }

      // Simular níveis a partir das questões
      const levelsMap = new Map();
      questionsData.forEach(q => {
        const levelNum = q.level || 1;
        if (!levelsMap.has(levelNum)) {
          levelsMap.set(levelNum, {
            id: `level_${world.id}_${levelNum}`,
            name: `Nível ${levelNum}`,
            difficulty: q.difficulty || 'Normal',
            number: levelNum,
            questionsCount: 0,
            completed: false // Você precisaria buscar isso do progresso do usuário
          });
        }
        levelsMap.get(levelNum).questionsCount++;
      });
      
      const levelsDataSimulated = Array.from(levelsMap.values()).sort((a, b) => a.number - b.number);
      setLevels(levelsDataSimulated);

    } catch (error) {
      console.error('Erro ao carregar níveis:', error);
      Alert.alert('Erro', 'Não foi possível carregar os níveis');
    } finally {
      setLoading(false);
    }
  };

  const handleLevelSelect = async (level) => {
    try {
      // ✅ CORREÇÃO: Buscar questões novamente para este nível específico
      const allQuestions = await awsApiService.getQuestions(world.id, level.number);
      
      // Filtra as questões por nível (embora a API já deva fazer isso)
      const levelQuestions = allQuestions.filter(q => q.level === level.number);

      if (levelQuestions.length === 0) {
        Alert.alert('Sem Questões', 'Este nível não possui questões disponíveis');
        return;
      }

      navigation.navigate('QuestionArea', {
        world: world,
        level: level,
        questions: levelQuestions, // Passando as questões filtradas
        user: user
      });
    } catch (error) {
      console.error('Erro ao carregar questões:', error);
      Alert.alert('Erro', 'Não foi possível carregar as questões');
    }
  };

  const renderLevelCard = (level) => (
    <TouchableOpacity
      key={level.id}
      style={styles.levelCard}
      onPress={() => handleLevelSelect(level)}
    >
      <LinearGradient
        colors={world.color || ['#3b82f6', '#1e3a8a']} // Cor padrão
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.levelContent}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelName}>{level.name}</Text>
            <Text style={styles.levelDifficulty}>{level.difficulty}</Text>
          </View>
          
          <View style={styles.questionsInfo}>
            <Ionicons name="document-text" size={16} color="#fff" />
            <Text style={styles.questionsText}>
              {level.questionsCount} questão{level.questionsCount !== 1 ? 'es' : ''}
            </Text>
          </View>

          <View style={styles.starsContainer}>
            {[1, 2, 3].map((star) => (
              <Ionicons
                key={star}
                name={level.completed ? "star" : "star-outline"}
                size={20}
                color={level.completed ? "#fbbf24" : "#ffffff80"}
              />
            ))}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fbbf24" />
        <Text style={styles.loadingText}>Carregando níveis...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={world.color || ['#3b82f6', '#1e3a8a']} // Cor padrão
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{world.name}</Text>
            <Text style={styles.subtitle}>{world.description}</Text>
          </View>
        </View>

        {/* Conteúdo */}
        <ScrollView 
          style={styles.levelsContainer}
          contentContainerStyle={styles.levelsContent}
        >
          <Text style={styles.sectionTitle}>Selecione um Nível</Text>
          
          <View style={styles.levelsGrid}>
            {levels.map(renderLevelCard)}
          </View>

          {levels.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={64} color="#ffffff80" />
              <Text style={styles.emptyStateText}>Nenhum nível disponível</Text>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e3a8a',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(30, 58, 138, 0.9)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#d1d5db',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  userInfo: {
    alignItems: 'flex-end',
  },
  userLevel: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: 'bold',
  },
  levelsContainer: {
    flex: 1,
  },
  levelsContent: {
    padding: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  levelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  levelCard: {
    width: '48%',
    height: 120,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradient: {
    flex: 1,
    padding: 1,
  },
  levelContent: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    margin: 1,
    borderRadius: 15,
    padding: 15,
    justifyContent: 'space-between',
  },
  levelHeader: {
    alignItems: 'center',
  },
  levelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  levelDifficulty: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
    questionsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    opacity: 0.8,
  },
  questionsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 5,
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  lockedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    color: '#ffffff80',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
});

export default LevelSelectionScreen;
