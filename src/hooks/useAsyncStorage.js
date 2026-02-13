// src/hooks/useAsyncStorage.js - CORRIGIDO
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAsyncStorage = (key, defaultValue) => {
  const [state, setState] = useState(defaultValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
          setState(JSON.parse(value));
        }
      } catch (error) {
        console.error('❌ Erro ao carregar do AsyncStorage:', error);
      } finally {
        setLoaded(true);
      }
    };

    loadData();
  }, [key]);

  const setValue = async (value) => {
    try {
      setState(value);
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('❌ Erro ao salvar no AsyncStorage:', error);
    }
  };

  return [state, setValue, loaded];
};