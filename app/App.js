// App.js
import React, { useState, useEffect } from 'react';
import ConfirmEmailScreen from './src/screens/ConfirmEmailScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator } from 'react-native';

// ❌ CONFIGURAÇÃO REMOVIDA DAQUI
// A configuração do Amplify agora está no index.js

// ✅ Importe os serviços
import { awsApiService } from './src/services/awsApiService';
import { authService } from './src/services/authService';

// ✅ Importe as telas
import StudentLoginScreen from './src/screens/StudentLoginScreen';
import TeacherLoginScreen from './src/screens/TeacherLoginScreen';
import StudentDashboardScreen from './src/screens/StudentDashboardScreen';
import TeacherDashboardScreen from './src/screens/TeacherDashboardScreen';
import QuestionAreaScreen from './src/screens/QuestionAreaScreen';
import RankingScreen from './src/screens/RankingScreen';
import WorldMapScreen from './src/screens/WorldMapScreen';
import ShopScreen from './src/screens/ShopScreen';
import MultiplayerLobbyScreen from './src/screens/MultiplayerLobbyScreen';
import LevelSelectionScreen from './src/screens/LevelSelectionScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      console.log('[v0] Checking authentication...');
      const authData = await authService.checkAuth();
      
      if (authData) {
        console.log('[v0] User authenticated, fetching profile...');
        awsApiService.setAuthToken(authData.token); 
        const userProfile = await awsApiService.getUserProfile(authData.userId);
        setUser(userProfile);
        console.log('[v0] User profile loaded successfully');
      } else {
        console.log('[v0] No active session');
        setUser(null);
      }
    } catch (error) {
      console.error('[v0] Error checking authentication:', error);
      setError(error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4c1d95' }}>
        <ActivityIndicator size="large" color="#fbbf24" />
        <Text style={{ color: 'white', fontSize: 18, marginTop: 10 }}>Carregando Reino Mágico... ✨</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4c1d95', padding: 20 }}>
        <Text style={{ color: 'white', fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
          Erro ao inicializar o app 😔
        </Text>
        <Text style={{ color: '#fbbf24', fontSize: 14, textAlign: 'center' }}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={user ? "StudentDashboard" : "StudentLogin"}
          screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
        >
          <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} /> 
          <Stack.Screen name="StudentLogin" component={StudentLoginScreen} />
          <Stack.Screen name="TeacherLogin" component={TeacherLoginScreen} />
          <Stack.Screen name="StudentDashboard" component={StudentDashboardScreen} />
          <Stack.Screen name="TeacherDashboard" component={TeacherDashboardScreen} />
          <Stack.Screen name="QuestionArea" component={QuestionAreaScreen} />
          <Stack.Screen name="Ranking" component={RankingScreen} />
          <Stack.Screen name="WorldMap" component={WorldMapScreen} />
          <Stack.Screen name="Shop" component={ShopScreen} />
          <Stack.Screen name="MultiplayerLobby" component={MultiplayerLobbyScreen} />
          <Stack.Screen name="LevelSelection" component={LevelSelectionScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
