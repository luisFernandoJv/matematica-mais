// src/hooks/useGame.js
import { useState, useEffect } from 'react';
// Importar de 'awsApiService' e 'authService'
import { awsApiService } from '../services/awsApiService';
import { authService } from '../services/authService'; 
import { useAsyncStorage } from './useAsyncStorage';

export const useGame = (userId) => {
  const [user, setUser] = useAsyncStorage('gameUser', null);
  const [worlds, setWorlds] = useState([]);
  const [dailyQuests, setDailyQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [multiplayerSession, setMultiplayerSession] = useState(null);

  // Carregar dados do usuário
  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Chamada real ao 'awsApiService' (Isto está correto!)
      const firebaseUser = await awsApiService.getUserProfile(userId);
      if (firebaseUser) {
        setUser(firebaseUser);
      }
      
      // Chamada real ao 'awsApiService' (Isto está correto!)
      const worldsData = await awsApiService.getWorlds();
      setWorlds(worldsData);
      
      // ⚠️ AINDA SIMULADO: 'getDailyQuests'
      // Seu 'awsApiService.js' ainda não possui a função 'getDailyQuests(userId)'.
      // Você precisa implementá-la no backend (AWS) e no 'awsApiService.js'.
      // const questsData = await awsApiService.getDailyQuests(userId); 
      const questsData = []; // Mantendo simulação por enquanto
      setDailyQuests(questsData);
      
    } catch (error) {
      console.error('Erro ao carregar dados do jogo:', error);
    } finally {
      setLoading(false);
    }
  };

  // Completar quest
  const completeQuest = async (questId, reward) => {
    try {
      // ⚠️ AINDA SIMULADO: 'completeQuest'
      // Seu 'awsApiService.js' ainda não possui a função 'completeQuest'.
      // Você precisa implementá-la.
      // const success = await awsApiService.completeQuest(userId, questId, reward);
      const success = true; // Mantendo simulação
      if (success) {
        // Recarregar dados do usuário
        await loadUserData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao completar quest:', error);
      return false;
    }
  };

  // Adicionar moedas
  const addCoins = async (coins) => {
    try {
      // Chamada real para 'awsApiService.addCoins' (Isto está correto!)
      const newBalance = await awsApiService.addCoins(userId, coins);
      if (newBalance !== null) {
        await loadUserData(); // Recarregar dados
        return newBalance;
      }
      return null;
    } catch (error) {
      console.error('Erro ao adicionar moedas:', error);
      return null;
    }
  };

  // ⚠️ AINDA SIMULADO: Multiplayer
  // Seu 'awsApiService.js' não possui funções de multiplayer.
  // Você precisará implementá-las (ex: createSession, joinSession).
  const createMultiplayerSession = async (worldId, maxPlayers = 4) => {
    try {
      // const sessionId = await awsApiService.createSession(userId, worldId, maxPlayers);
      const sessionId = 'simulated_session_123'; // Simulado
      if (sessionId) {
        // awsApiService.listenToSession(sessionId, (session) => {
        //   setMultiplayerSession(session);
        // });
        setMultiplayerSession({ id: sessionId, host: userId, players: [userId] }); // Simulado
        return sessionId;
      }
      return null;
    } catch (error) {
      console.error('Erro ao criar sessão multiplayer:', error);
      return null;
    }
  };

  const joinMultiplayerSession = async (sessionId) => {
    try {
      // const success = await awsApiService.joinSession(sessionId, userId);
      const success = true; // Simulado
      if (success) {
        // awsApiService.listenToSession(sessionId, (session) => {
        //   setMultiplayerSession(session);
        // });
        setMultiplayerSession({ id: sessionId, host: 'hostId', players: ['hostId', userId] }); // Simulado
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao entrar na sessão:', error);
      return false;
    }
  };

  return {
    user,
    worlds,
    dailyQuests,
    loading,
    multiplayerSession,
    completeQuest,
    addCoins,
    createMultiplayerSession,
    joinMultiplayerSession,
    refreshData: loadUserData
  };
};

