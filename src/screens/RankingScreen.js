// src/screens/RankingScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// ✅ CORREÇÃO: Importar o 'awsApiService'
import { awsApiService } from '../services/awsApiService';

const RankingScreen = ({ navigation, route }) => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadRanking();
  }, []);

  const loadRanking = async () => {
    try {
      setLoading(true);
      // ✅ CORREÇÃO: Chamar a função do 'awsApiService'
      const rankingData = await awsApiService.getGlobalRanking();
      setRanking(rankingData);
    } catch (error) {
      console.error('❌ Erro ao carregar ranking:', error);
      // Fallback para dados de exemplo
      setRanking(getSampleRanking());
    } finally {
      setLoading(false);
    }
  };

  const getSampleRanking = () => [
    { id: 1, name: 'Ana Silva', school: '🏰 E.M.E.F Lica Duarte', score: 2500, level: '🌟 Lenda Viva', quizzes: 18 },
    { id: 2, name: 'Pedro Santos', school: '⚔️ E.M.E.F Benevenuto Mariano', score: 2200, level: '👑 Grão-Mestre', quizzes: 15 },
    // ... mais dados de exemplo
  ];

  const getRankIcon = (position) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return `${position}º`;
  };

  if (loading) {
    return (
      <LinearGradient colors={['#4c1d95', '#7c3aed', '#ec4899']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#fbbf24" />
            <Text style={styles.loadingText}>Carregando ranking...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    // ... (JSX permanece igual, mas usando o estado 'ranking')
    <LinearGradient colors={['#4c1d95', '#7c3aed', '#ec4899']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()} // Adicionando funcionalidade ao botão voltar
          >
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🏆 Ranking</Text>
          <Text style={styles.subtitle}>Os Maiores Heróis do Saber</Text>
        </View>
        
        {/* Filtros */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={styles.filterButtonText}>Geral</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'school' && styles.filterButtonActive]}
            onPress={() => setFilter('school')}
          >
            <Text style={styles.filterButtonText}>Minha Escola</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.rankingList} contentContainerStyle={styles.rankingContent}>
          {ranking.map((player, index) => (
            <View
              key={player.id}
              style={[
                styles.rankingCard,
                index < 3 && styles.rankingCardTop
              ]}
            >
              <View style={styles.rankingPosition}>
                <Text style={styles.rankingPositionText}>{getRankIcon(index + 1)}</Text>
              </View>
              <View style={styles.rankingInfo}>
                <Text style={styles.rankingName}>{player.name}</Text>
                <Text style={styles.rankingSchool}>{player.school}</Text>
                <Text style={styles.rankingLevel}>{player.level}</Text>
              </View>
              <View style={styles.rankingStats}>
                <Text style={styles.rankingScore}>{player.score}</Text>
                <Text style={styles.rankingScoreLabel}>Pontos</Text>
                <Text style={styles.rankingQuizzes}>{player.quizzes} quizzes</Text>
              </View>
            </View>
          ))}
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    position: 'absolute', // Para ficar no canto
    top: 20,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(251,191,36,0.3)',
    borderColor: '#fbbf24',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  rankingList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  rankingContent: {
    paddingBottom: 20,
  },
  rankingCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  rankingCardTop: {
    backgroundColor: 'rgba(251,191,36,0.2)',
    borderColor: '#fbbf24',
  },
  rankingPosition: {
    width: 50,
    alignItems: 'center',
  },
  rankingPositionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  rankingInfo: {
    flex: 1,
    marginLeft: 10,
  },
  rankingName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  rankingSchool: {
    fontSize: 12,
    color: '#e0e7ff',
    marginBottom: 2,
  },
  rankingLevel: {
    fontSize: 14,
    color: '#fbbf24',
    fontWeight: '600',
  },
  rankingStats: {
    alignItems: 'flex-end',
  },
  rankingScore: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  rankingScoreLabel: {
    fontSize: 10,
    color: '#e0e7ff',
  },
  rankingQuizzes: {
    fontSize: 12,
    color: '#e0e7ff',
    marginTop: 2,
  },
  userPositionCard: {
    backgroundColor: 'rgba(16,185,129,0.2)',
    borderTopWidth: 2,
    borderTopColor: '#10b981',
    padding: 20,
  },
  userPositionLabel: {
    fontSize: 14,
    color: '#e0e7ff',
    marginBottom: 10,
    textAlign: 'center',
  },
  userPositionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userPositionRank: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10b981',
    marginRight: 15,
  },
  userPositionDetails: {
    alignItems: 'flex-start',
  },
  userPositionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  userPositionScore: {
    fontSize: 14,
    color: '#e0e7ff',
  },
});

export default RankingScreen;

