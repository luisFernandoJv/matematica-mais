// src/screens/MultiplayerLobbyScreen.js
import React, { useState, useEffect } from 'react'; // ✅ Importado
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator, // ✅ Importado
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
// ✅ Importar o 'awsApiService'
import { awsApiService } from '../services/awsApiService';

const MultiplayerLobbyScreen = ({ navigation, route }) => {
  const { user } = route.params || {};
  const [activeTab, setActiveTab] = useState('join'); // 'join' or 'create'
  const [rooms, setRooms] = useState([]); // ✅ Estado para salas reais
  const [loading, setLoading] = useState(true); // ✅ Estado de loading

  // ✅ Efeito para carregar salas
  useEffect(() => {
    if (activeTab === 'join') {
      loadRooms();
    }
  }, [activeTab]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      // TODO: Você precisará criar este endpoint no backend
      // const roomsData = await awsApiService.getRooms();
      
      // **** Simulação temporária (substitua pela linha acima) ****
      const roomsData = [
        { id: 'room_1', name: 'Desafio Matemático 🧮', host: 'Ana Silva', players: 3, maxPlayers: 4, world: 'Matemágica', difficulty: 'Médio' },
        { id: 'room_2', name: 'Batalha de Ciências 🔬', host: 'Pedro Santos', players: 2, maxPlayers: 4, world: 'Ciências Encantadas', difficulty: 'Difícil' },
        { id: 'room_3', name: 'Duelo de Letras 📚', host: 'Maria Costa', players: 1, maxPlayers: 4, world: 'Reino das Letras', difficulty: 'Fácil' }
      ];
      // **** Fim da simulação ****

      setRooms(roomsData);
    } catch (error) {
      console.error('Erro ao carregar salas:', error);
      Alert.alert('Erro', 'Não foi possível buscar as salas.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = (room) => {
    // ... (lógica de 'handleJoinRoom' permanece a mesma, pois é complexa)
  };

  const handleCreateRoom = async () => {
    // TODO: A lógica de 'handleCreateRoom' precisaria chamar
    // await awsApiService.createRoom({ ... });
    
    Alert.alert(
      'Criar Sala',
      'Escolha o tipo de sala:',
      [
        { text: 'Sala Rápida', onPress: () => createRoom('quick') },
        { text: 'Sala Personalizada', onPress: () => createRoom('custom') },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };
  
  // ... (o resto do arquivo, incluindo 'createRoom', 'return' e 'styles', permanece igual)
  
  const createRoom = (type) => {
    const roomId = `room_${Date.now()}`;
    const room = {
      id: roomId,
      name: type === 'quick' ? 'Sala Rápida ⚡' : 'Sala Personalizada 🎯',
      host: user.name,
      players: 1,
      maxPlayers: 4,
      world: 'Misto',
      difficulty: 'Variado'
    };

    Alert.alert('🎮 Sala Criada!', `Sala "${room.name}" criada com sucesso!`);
    // navigation.navigate('MultiplayerGame', { room, user });
  };

  return (
    <LinearGradient colors={['#4c1d95', '#7c3aed', '#ec4899']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>👥 Multiplayer</Text>
          <Text style={styles.subtitle}>Jogue com amigos em tempo real!</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'join' && styles.tabActive]}
            onPress={() => setActiveTab('join')}
          >
            <Text style={styles.tabText}>🎯 Entrar em Sala</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'create' && styles.tabActive]}
            onPress={() => setActiveTab('create')}
          >
            <Text style={styles.tabText}>⚡ Criar Sala</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {activeTab === 'join' ? (
            <>
              <Text style={styles.sectionTitle}>Salas Disponíveis</Text>
              
              {/* ✅ CORREÇÃO: Usando 'loading' e estado 'rooms' */}
              {loading ? (
                <ActivityIndicator size="large" color="#fbbf24" style={{ marginVertical: 40 }} />
              ) : rooms.length > 0 ? (
                <View style={styles.roomsContainer}>
                  {rooms.map((room) => (
                    <TouchableOpacity
                      key={room.id}
                      style={styles.roomCard}
                      onPress={() => handleJoinRoom(room)}
                    >
                      {/* ... (renderização do card) ... */}
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text style={styles.noRoomsText}>
                  Nenhuma sala disponível no momento. Que tal criar uma?
                </Text>
              )}
            </>
          ) : (
            <>
              {/* ... (tela de 'Criar Sala' permanece a mesma) ... */}
            </>
          )}

          {/* ... (resto do JSX) ... */}
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
  header: {
    padding: 20,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: 'rgba(251,191,36,0.3)',
  },
  tabText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  roomsContainer: {
    gap: 15,
    marginBottom: 20,
  },
  roomCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  roomPlayers: {
    fontSize: 14,
    color: '#e0e7ff',
    fontWeight: '600',
  },
  roomInfo: {
    marginBottom: 10,
  },
  roomHost: {
    fontSize: 14,
    color: '#e0e7ff',
    marginBottom: 2,
  },
  roomWorld: {
    fontSize: 14,
    color: '#e0e7ff',
    marginBottom: 2,
  },
  roomDifficulty: {
    fontSize: 14,
    color: '#e0e7ff',
  },
  roomStatus: {
    alignItems: 'flex-end',
  },
  roomAvailable: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  roomFull: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  noRoomsText: {
    color: '#e0e7ff',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20,
  },
  createRoomCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,
  },
  createTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  createDescription: {
    fontSize: 14,
    color: '#e0e7ff',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  roomOptions: {
    gap: 12,
    marginBottom: 25,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 8,
  },
  optionLabel: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  optionValue: {
    fontSize: 14,
    color: '#fbbf24',
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#fbbf24',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#e0e7ff',
    lineHeight: 20,
  },
});

export default MultiplayerLobbyScreen;