// src/screens/StudentLoginScreen.js
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { isValidName, isValidAge } from '../utils/validation';
import { AVAILABLE_SCHOOLS } from '../constants/constants';
import { authService } from '../services/authService';

const StudentLoginScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [school, setSchool] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  // Função de teste para o Google Play
  const handleGuestLogin = () => {
    const mockUser = {
      id: 'google-play-test-user',
      name: 'Avaliador Google Play',
      email: 'test@google.com',
      avatar: '🤖',
      school: 'Escola de Testes',
      coins: 1000,
      experience: 500,
      level: 5,
    };
    Alert.alert(
      'Modo de Teste Ativado',
      'Entrando como "Avaliador Google Play".',
      [
        {
          text: 'OK',
          onPress: () => navigation.replace('StudentDashboard', { user: mockUser }),
        },
      ]
    );
  };

  // ✅ ================================================================
  // ✅ FUNÇÃO DE AUTENTICAÇÃO TOTALMENTE CORRIGIDA
  // ✅ ================================================================
  const handleAuth = async () => {
    setIsLoading(true);

    try {
      // Validações
      if (!email || !password) {
        Alert.alert('Erro', 'Por favor, preencha email e senha');
        setIsLoading(false);
        return;
      }
      if (!isLogin && (!name || !age || !school)) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos de cadastro');
        setIsLoading(false);
        return;
      }
      // ... (outras validações)

      let result;

      if (isLogin) {
        // ========== FLUXO DE LOGIN ==========
        result = await authService.login(email.trim(), password);
        
        if (result.success) {
          // SUCESSO: Login feito, navegar para o Dashboard
          navigation.replace('StudentDashboard', { user: result.user });
        } else if (result.needsConfirmation) {
          // FALHA (NÃO CONFIRMADO): Navegar para a tela de confirmação
          Alert.alert(
            'Confirmação Pendente',
            'Seu e-mail ainda não foi confirmado. Enviamos um código para você.',
            [
              { text: 'OK', onPress: () => navigation.navigate('ConfirmEmail', { email: email.trim() }) }
            ]
          );
        } else {
          // OUTRA FALHA: Senha errada, etc.
          Alert.alert('Erro no Login', result.error || 'Email ou senha inválidos.');
        }

      } else {
        // ========== FLUXO DE CADASTRO ==========
        result = await authService.register({
          name: name.trim(),
          age: parseInt(age),
          school: school,
          email: email.trim(),
          password: password,
        });

        if (result.success) {
          // SUCESSO: Cadastro feito, navegar para a tela de confirmação
          Alert.alert(
            'Cadastro Quase Lá!',
            `Enviamos um código de 6 dígitos para ${email.trim()}. Por favor, verifique seu e-mail (e a caixa de spam).`,
            [
              { text: 'OK', onPress: () => navigation.navigate('ConfirmEmail', { email: email.trim() }) }
            ]
          );
        } else {
          // FALHA: Tratar erros comuns de cadastro
          if (result.error.includes('User already exists') || result.error.includes('UsernameExistsException')) {
            Alert.alert(
              'Usuário Já Existe',
              'Este e-mail já está cadastrado. Tente fazer o login.',
              [{ text: 'OK', onPress: () => {
                setIsLogin(true); // Muda para o modo login
                setCurrentStep(1); // Reseta para a etapa de login
              }}]
            );
          } else {
            Alert.alert('Erro no Cadastro', result.error || 'Não foi possível criar sua conta.');
          }
        }
      }
    } catch (error) {
      Alert.alert('Erro Inesperado', 'Ocorreu um erro. Tente novamente.');
      console.error('Erro em handleAuth:', error);
    } finally {
      setIsLoading(false);
    }
  };
  // ✅ ================================================================
  // ✅ FIM DA CORREÇÃO
  // ✅ ================================================================


  const nextStep = () => {
    if (currentStep === 1 && (!name.trim() || !isValidName(name))) {
      Alert.alert('Erro', 'Digite um nome válido');
      return;
    }
    if (currentStep === 2 && !isValidAge(age)) {
      Alert.alert('Erro', 'Digite uma idade válida (6-18 anos)');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setCurrentStep(1);
    setName('');
    setAge('');
    setSchool('');
    setEmail('');
    setPassword('');
  };

  // ... (O JSX de renderStep, return e styles permanece o mesmo)
  // ... (Nenhuma mudança necessária no visual, apenas na lógica 'handleAuth')
  const renderStep = () => {
    if (isLogin) {
      // Modo Login
      switch (currentStep) {
        case 1:
          return (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Fazer Login</Text>
              <Text style={styles.stepSubtitle}>Entre com sua conta existente! 🔐</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Seu email"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoFocus
              />
              
              <TextInput
                style={styles.input}
                placeholder="Sua senha"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              
              <TouchableOpacity 
                style={[styles.primaryButton, isLoading && styles.buttonDisabled]} 
                onPress={handleAuth}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>🚀 Entrar na Aventura!</Text>
                )}
              </TouchableOpacity>
            </View>
          );
        default:
          return null;
      }
    } else {
      // Modo Cadastro
      switch (currentStep) {
        case 1:
          return (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Qual é o seu nome, herói?</Text>
              <Text style={styles.stepSubtitle}>Vamos conhecer o novo aventureiro! 🌟</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Maria Silva"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={name}
                onChangeText={setName}
                autoFocus
                autoCapitalize="words"
              />
              <TouchableOpacity style={styles.primaryButton} onPress={nextStep}>
                <Text style={styles.buttonText}>Próximo ⚔️</Text>
              </TouchableOpacity>
            </View>
          );
        case 2:
          return (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Quantos anos você tem?</Text>
              <Text style={styles.stepSubtitle}>Conte-nos sua idade mágica! 🎂</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 12"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                maxLength={2}
                autoFocus
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.secondaryButton} onPress={prevStep}>
                  <Text style={styles.buttonText}>⬅️ Voltar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryButton} onPress={nextStep}>
                  <Text style={styles.buttonText}>Próximo ⚔️</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        case 3:
          return (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Qual é sua escola?</Text>
              <Text style={styles.stepSubtitle}>Escolha seu castelo de sabedoria! 🏰</Text>
              <ScrollView 
                style={styles.schoolList}
                showsVerticalScrollIndicator={false}
              >
                {AVAILABLE_SCHOOLS.map((schoolOption, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.schoolOption,
                      school === schoolOption && styles.schoolOptionSelected
                    ]}
                    onPress={() => setSchool(schoolOption)}
                  >
                    <Text style={styles.schoolOptionText}>{schoolOption}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.secondaryButton} onPress={prevStep}>
                  <Text style={styles.buttonText}>⬅️ Voltar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryButton} onPress={nextStep}>
                  <Text style={styles.buttonText}>Próximo ⚔️</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        case 4:
          return (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Criar Conta</Text>
              <Text style={styles.stepSubtitle}>Crie suas credenciais mágicas! 🔐</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Seu email"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoFocus
              />
              
              <TextInput
                style={styles.input}
                placeholder="Sua senha (mínimo 6 caracteres)"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.secondaryButton} onPress={prevStep}>
                  <Text style={styles.buttonText}>⬅️ Voltar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.primaryButton, isLoading && styles.buttonDisabled]} 
                  onPress={handleAuth}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>🚀 Começar Aventura!</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          );
        default:
          return null;
      }
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4c1d95', '#7c3aed', '#ec4899']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={styles.title}>🏰 Reino do Saber</Text>
              <Text style={styles.subtitle}>
                {isLogin ? '⚔️ Bem-vindo de volta, herói! ✨' : '⚔️ Sua aventura épica começa aqui! ✨'}
              </Text>
              
              {!isLogin && (
                <View style={styles.progressContainer}>
                  {[1, 2, 3, 4].map((step) => (
                    <View
                      key={step}
                      style={[
                        styles.progressDot,
                        step <= currentStep && styles.progressDotActive
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>

            <View style={styles.card}>
              {renderStep()}
            </View>

            <TouchableOpacity 
              style={styles.toggleAuthButton}
              onPress={toggleAuthMode}
            >
              <Text style={styles.toggleAuthText}>
                {isLogin 
                  ? '🎓 Novo por aqui? Crie sua conta!' 
                  : '🔐 Já tem uma conta? Faça login!'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.teacherLink}
              onPress={() => navigation.navigate('TeacherLogin')}
            >
              <Text style={styles.teacherLinkText}>
                👨‍🏫 Sou Professor(a)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.guestLink}
              onPress={handleGuestLogin}
            >
              <Text style={styles.guestLinkText}>
                🤖 Modo de Teste (Avaliador)
              </Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
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
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressDotActive: {
    backgroundColor: '#fbbf24',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '600',
  },
  schoolList: {
    width: '100%',
    maxHeight: 200, 
    marginBottom: 20,
  },
  schoolOption: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  schoolOptionSelected: {
    backgroundColor: 'rgba(251,191,36,0.3)',
    borderColor: '#fbbf24',
  },
  schoolOptionText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#fbbf24',
    borderRadius: 12,
    padding: 16,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54, 
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
    minWidth: 120,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  toggleAuthButton: {
    marginBottom: 15,
    alignItems: 'center',
    padding: 10,
  },
  toggleAuthText: {
    color: '#fbbf24',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  teacherLink: {
    alignItems: 'center',
    padding: 10,
  },
  teacherLinkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  guestLink: {
    alignItems: 'center',
    padding: 10,
    marginTop: 5,
  },
  guestLinkText: {
    color: '#fbbf24', 
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'italic',
  },
});

export default StudentLoginScreen;