// src/screens/ConfirmEmailScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { authService } from '../services/authService';

export default function ConfirmEmailScreen({ route, navigation }) {
  // Recebe o email da tela de cadastro
  const { email } = route.params; 
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (loading) return;
    setLoading(true);

    const result = await authService.confirmRegistration(email, code);

    setLoading(false);

    if (result.success) {
      Alert.alert(
        'Conta Confirmada!',
        'Seu e-mail foi verificado com sucesso. Agora você pode fazer o login.',
        [{ text: 'OK', onPress: () => navigation.replace('StudentLogin') }]
      );
    } else {
      Alert.alert('Erro', result.error || 'Não foi possível confirmar sua conta. Verifique o código.');
    }
  };

  // Você pode adicionar uma função para reenviar o código se desejar
  // const handleResendCode = async () => { ... }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verifique seu E-mail</Text>
      <Text style={styles.subtitle}>
        Enviamos um código de 6 dígitos para <Text style={styles.emailText}>{email}</Text>.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Código de 6 dígitos"
        placeholderTextColor="#9ca3af"
        keyboardType="numeric"
        maxLength={6}
        value={code}
        onChangeText={setCode}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleConfirm} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Confirmar</Text>
        )}
      </TouchableOpacity>
      
      {/* <TouchableOpacity onPress={handleResendCode}>
        <Text style={styles.resendText}>Reenviar código</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#4c1d95', // Cor de fundo do seu App.js
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#e5e7eb',
    textAlign: 'center',
    marginBottom: 30,
  },
  emailText: {
    fontWeight: 'bold',
    color: '#fbbf24', // Cor destaque
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 3,
  },
  button: {
    backgroundColor: '#fbbf24', // Cor destaque
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#4c1d95',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendText: {
    color: '#fbbf24',
    textAlign: 'center',
  },
});