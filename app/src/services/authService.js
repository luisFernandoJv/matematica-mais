// src/services/authService.js
import { 
  signUp, 
  signIn, 
  signOut, 
  getCurrentUser, 
  fetchAuthSession, 
  confirmSignUp 
} from 'aws-amplify/auth';
import { awsApiService } from './awsApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  
  async register(userData) {
    try {
      const { userId, isSignUpComplete } = await signUp({
        username: userData.email,
        password: userData.password,
        options: {
          userAttributes: {
            email: userData.email,
            name: userData.name,
            'custom:age': String(userData.age), 
            'custom:school': userData.school,
          },
        },
      });

      // Register user in DynamoDB
      await awsApiService.registerUser({
        userId: userId,
        email: userData.email,
        name: userData.name,
        school: userData.school,
        avatar: userData.avatar || '🦁',
      });

      // Retorna sucesso, indicando que o próximo passo é a confirmação
      // O auto-login foi removido daqui
      return { success: true, isSignUpComplete: false, userId };

    } catch (error) {
      console.error('❌ Erro no registro (Cognito):', error);
      return { success: false, error: error.message || 'Erro ao criar conta' };
    }
  },

  async confirmRegistration(email, code) {
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      return { success: true, isSignUpComplete };
    } catch (error) {
      console.error('❌ Erro na confirmação:', error);
      return { success: false, error: error.message || 'Código inválido ou expirado' };
    }
  },

  async login(email, password) {
    try {
      const { isSignedIn } = await signIn({ username: email, password });
      
      if (!isSignedIn) {
        return { success: false, error: 'Não foi possível fazer login' };
      }

      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      
      if (!token) {
        // Se não houver token, o login falhou ou a sessão não foi estabelecida corretamente.
        // O erro de login do Cognito deve ser tratado no bloco catch.
        return { success: false, error: 'Erro ao obter token de sessão.' };
      }

      // 1. Armazena o token no AsyncStorage e no awsApiService
      await this.storeAuthData(token);
      
      // 2. Obtém o usuário atual
      const currentUser = await getCurrentUser();
      const userId = currentUser.userId;
      
      // 3. Obtém o perfil do usuário usando o token recém-definido
      const userProfile = await awsApiService.getUserProfile(userId);

      return { success: true, user: userProfile };
    } catch (error) {
      console.error('❌ Erro no login (Cognito):', error);
      
      // ESSA LINHA É CRUCIAL
      if (error.name === 'UserNotConfirmedException') {
        return { success: false, error: 'Usuário não confirmado.', needsConfirmation: true };
      }
      // O erro [Unknown: An unknown error has occurred.] é frequentemente um problema de configuração
      // ou um erro de rede. O tratamento de erro genérico é mantido.
      return { success: false, error: error.message || 'Email ou senha inválidos' };
    }
  },

  async logout() {
    try {
      await signOut();
      await AsyncStorage.removeItem('auth_token');
      awsApiService.token = null;
      return { success: true };
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      return { success: false, error: error.message };
    }
  },

  async storeAuthData(token) {
    await AsyncStorage.setItem('auth_token', token);
    awsApiService.setAuthToken(token);
  },

  async checkAuth() {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      
      if (token && currentUser.userId) {
        // Garante que o token esteja definido no awsApiService no checkAuth
        awsApiService.setAuthToken(token);
        return { token, userId: currentUser.userId };
      }
      return null;
    } catch (error) {
      console.log('No active session');
      return null;
    }
  },

  async teacherLogin(email, password) {
    // ... (Sua função teacherLogin estava correta e permanece aqui)
    try {
      const { isSignedIn } = await signIn({ username: email, password });
      
      if (!isSignedIn) {
        // O erro [Unknown: An unknown error has occurred.] é frequentemente um problema de configuração
      // ou um erro de rede. O tratamento de erro genérico é mantido.
      return { success: false, error: error.message || 'Email ou senha inválidos' };
      }

      const session = await fetchAuthSession();
      const groups = session.tokens?.accessToken?.payload['cognito:groups'];
      
      if (!groups || !groups.includes('Teachers')) {
        await signOut();
        return { success: false, error: 'Usuário não tem permissão de professor.' };
      }

      const token = session.tokens?.idToken?.toString();
      if (token) {
        await this.storeAuthData(token);
      }

      const currentUser = await getCurrentUser();
      const userAttributes = session.tokens?.idToken?.payload;

      const teacherUser = {
        id: currentUser.userId,
        name: userAttributes?.name || 'Professor(a)',
        email: userAttributes?.email || email,
        role: 'teacher',
      };

      return { success: true, user: teacherUser };

    } catch (error) {
      console.error('❌ Erro no login do professor:', error);
      return { success: false, error: error.message || 'Email ou senha inválidos' };
    }
  },
};