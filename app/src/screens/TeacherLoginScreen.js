// src/screens/TeacherLoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { authService } from '../services/authService';

const TeacherLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('⚠️ Campos Vazios', 'Por favor, preencha todos os campos.');
      return;
    }
    // ... (validação de email)

    setIsLoading(true);
    
    try {
      // ✅ CORREÇÃO: Chamando a função real do authService
      const result = await authService.teacherLogin(email, password);
      
      // ❌ REMOVIDO: Bloco de simulação foi removido

      if (result.success) {
        navigation.replace('TeacherDashboard', { user: result.user });
      } else {
        Alert.alert('Erro', result.error || 'Email ou senha de professor inválidos.');
      }
      
    } catch (error) {
      console.error('Erro no login do professor:', error);
      Alert.alert('Erro', 'Não foi possível fazer o login.');
    } finally {
      setIsLoading(false);
    }
  };

  // ... (O resto do arquivo JSX e Estilos permanece 100% igual)
  return (
    <LinearGradient
      colors={['#1e3a8a', '#3b82f6', '#06b6d4']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.icon}>👨‍🏫</Text>
            <Text style={styles.title}>Portal do Professor</Text>
            <Text style={styles.subtitle}>Gerencie suas turmas e acompanhe o progresso</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>📧 Email</Text>
            <TextInput
              style={styles.input}
              placeholder="professor@escola.com"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />

            <Text style={styles.label}>🔒 Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>🚀 Entrar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => Alert.alert('Recuperação de Senha', 'Entre em contato com o administrador do sistema.')}
            >
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.studentLink}
            onPress={() => navigation.navigate('StudentLogin')}
          >
            <Text style={styles.studentLinkText}>
              🎓 Sou Estudante
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  // ... (Estilos permanecem 100% iguais)
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 25,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 58,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  forgotPassword: {
    marginTop: 15,
    alignItems: 'center',
    padding: 10,
  },
  forgotPasswordText: {
    color: '#e0e7ff',
    fontSize: 14,
  },
  studentLink: {
    marginTop: 20,
    alignItems: 'center',
    padding: 10,
  },
  studentLinkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TeacherLoginScreen;