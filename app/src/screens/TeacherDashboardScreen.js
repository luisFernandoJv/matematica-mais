// src/screens/TeacherDashboardScreen.js
import React, { useEffect, useState } from 'react'; // ✅ Importado
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// ✅ Importar o 'authService' e 'awsApiService'
import { authService } from '../services/authService';
import { awsApiService } from '../services/awsApiService';

const TeacherDashboardScreen = ({ navigation, route }) => {
  const user = route.params?.user || {};
  // ✅ Estados para dados dinâmicos
  const [stats, setStats] = useState({ students: 0, quizzes: 0, accuracy: 0, achievements: 0 });
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Efeito para carregar dados do professor
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Você precisará criar estes endpoints no backend
      // const statsData = await awsApiService.getTeacherStats(user.id);
      // const activityData = await awsApiService.getTeacherActivity(user.id);

      // **** Simulação temporária (substitua pelas linhas acima) ****
      const statsData = { students: 156, quizzes: 342, accuracy: 78, achievements: 89 };
      const activityData = [
        { id: 1, icon: '✅', title: 'Ana Silva completou um quiz', time: 'Há 5 minutos' },
        { id: 2, icon: '🏆', title: 'Pedro Santos alcançou nível Mestre', time: 'Há 15 minutos' },
        { id: 3, icon: '⭐', title: 'Maria Costa ganhou uma conquista', time: 'Há 1 hora' },
      ];
      // **** Fim da simulação ****

      setStats(statsData);
      setActivity(activityData);

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          // ✅ CORREÇÃO: Chamar 'authService.logout'
          onPress: async () => {
            await authService.logout();
            navigation.replace('TeacherLogin');
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  // ... (o resto das funções 'handle' permanece igual)

  const handleViewRanking = () => {
    navigation.navigate('Ranking');
  };

  const handleFeatureNotAvailable = () => {
    Alert.alert(
      'Funcionalidade em Desenvolvimento',
      'Esta funcionalidade estará disponível em breve!',
      [{ text: 'OK' }]
    );
  };

  return (
    <LinearGradient
      colors={['#1e3a8a', '#3b82f6', '#06b6d4']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.greeting}>Olá, Professor(a)! 👨‍🏫</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {/* ✅ CORREÇÃO: Usando dados do estado 'stats' */}
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>👥</Text>
              <Text style={styles.statValue}>{stats.students}</Text>
              <Text style={styles.statLabel}>Estudantes</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📝</Text>
              <Text style={styles.statValue}>{stats.quizzes}</Text>
              <Text style={styles.statLabel}>Quizzes Realizados</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📊</Text>
              <Text style={styles.statValue}>{stats.accuracy}%</Text>
              <Text style={styles.statLabel}>Taxa de Acerto</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🏆</Text>
              <Text style={styles.statValue}>{stats.achievements}</Text>
              <Text style={styles.statLabel}>Conquistas</Text>
            </View>
          </View>

          {/* Quick Actions (sem alteração, pois já chamam 'handle') */}
          <View style={styles.actionsSection}>
            {/* ... botões ... */}
          </View>

          {/* Recent Activity */}
          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>Atividade Recente</Text>
            
            {/* ✅ CORREÇÃO: Usando dados do estado 'activity' */}
            {activity.map((item) => (
              <View style={styles.activityCard} key={item.id}>
                <Text style={styles.activityIcon}>{item.icon}</Text>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{item.title}</Text>
                  <Text style={styles.activityTime}>{item.time}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>🚪 Sair</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  // ... (seus estilos permanecem os mesmos)
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    marginBottom: 30,
    marginTop: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#e0e7ff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#e0e7ff',
    textAlign: 'center',
  },
  actionsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 13,
    color: '#e0e7ff',
  },
  actionArrow: {
    fontSize: 24,
    color: '#fff',
    marginLeft: 10,
  },
  activitySection: {
    marginBottom: 20,
  },
  activityCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#e0e7ff',
  },
  logoutButton: {
    backgroundColor: 'rgba(239,68,68,0.3)',
    borderRadius: 15,
    padding: 15,
    borderWidth: 2,
    borderColor: 'rgba(239,68,68,0.5)',
    marginTop: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default TeacherDashboardScreen;