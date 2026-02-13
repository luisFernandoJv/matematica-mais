// src/components/AnimatedAvatar.js - CORRIGIDO
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AVATAR_PARTS } from '../services/avatarService';

const AnimatedAvatar = ({ 
  avatarConfig = {}, 
  size = 120, 
  isAnimating = true,
  emotion = 'happy',
  style 
}) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const config = {
    body: avatarConfig.body || 'body_default',
    head: avatarConfig.head || 'head_default',
    hair: avatarConfig.hair || 'hair_default', 
    eyes: avatarConfig.eyes || 'eyes_default',
    clothes: avatarConfig.clothes || 'clothes_default',
    accessories: avatarConfig.accessories || 'accessory_none'
  };

  useEffect(() => {
    if (isAnimating) {
      // Animação de flutuação
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: -8,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Piscar os olhos
      const blinkInterval = setInterval(() => {
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      }, 3000 + Math.random() * 2000);

      // Efeito de brilho
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      return () => clearInterval(blinkInterval);
    }
  }, [isAnimating]);

    const getPartColor = (partType, partId) => {
    // Pega o array de partes (ex: todos os cabelos, todos os olhos)
    const partsArray = AVATAR_PARTS[partType];

    // 1. Verifica se o array existe. Se não, retorna uma cor padrão.
    if (!partsArray || !Array.isArray(partsArray)) {
        console.warn(`[AnimatedAvatar] Tipo de parte inválido ou não encontrado: "${partType}"`);
        return '#666666'; // Retorna uma cor de fallback segura
    }

    // 2. Se o array existe, aí sim procura a parte específica pelo ID.
    const part = partsArray.find(p => p.id === partId);

    // 3. Retorna a cor da parte ou a cor de fallback se o ID não for encontrado.
    return part?.color || '#666666';
    };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  // Calcular estilos dinamicamente baseado no size
  const dynamicStyles = {
    container: {
      width: size,
      height: size,
    },
    glowEffect: {
      width: size * 1.2,
      height: size * 1.2,
      borderRadius: size * 0.6,
    },
    body: {
      width: size * 0.5,
      height: size * 0.6,
    },
    clothes: {
      width: size * 0.6,
      height: size * 0.4,
    },
    head: {
      width: size * 0.4,
      height: size * 0.35,
    },
    hair: {
      width: size * 0.5,
      height: size * 0.2,
    },
    wingLeft: {
      left: -size * 0.3,
    },
    wingRight: {
      right: -size * 0.3,
    },
    crown: {
      bottom: size * 0.75,
    },
    halo: {
      bottom: size * 0.8,
    },
    sparkle1: {
      top: size * 0.15,
      right: size * 0.15,
    },
    sparkle2: {
      bottom: size * 0.25,
      left: size * 0.15,
    }
  };

  return (
    <View style={[styles.container, dynamicStyles.container, style]}>
      {/* Efeito de brilho */}
      <Animated.View 
        style={[
          styles.glowEffect,
          dynamicStyles.glowEffect,
          {
            opacity: glowOpacity,
          }
        ]}
      />
      
      <Animated.View 
        style={[
          styles.avatarContainer,
          {
            transform: [
              { translateY: floatAnim }
            ]
          }
        ]}
      >
        {/* Asas */}
        {config.accessories === 'accessory_wings' && (
          <View style={styles.wings}>
            <Ionicons 
              name="sparkles" 
              size={size * 0.7} 
              color="#00ff88" 
              style={[styles.wingLeft, dynamicStyles.wingLeft]} 
            />
            <Ionicons 
              name="sparkles" 
              size={size * 0.7} 
              color="#00ff88" 
              style={[styles.wingRight, dynamicStyles.wingRight]} 
            />
          </View>
        )}

        {/* Corpo */}
        <View style={[
          styles.body,
          dynamicStyles.body,
          { 
            backgroundColor: getPartColor('body', config.body),
            shadowColor: getPartColor('body', config.body),
          }
        ]} />

        {/* Roupa */}
        <View style={[
          styles.clothes,
          dynamicStyles.clothes,
          { 
            backgroundColor: getPartColor('clothes', config.clothes),
          }
        ]} />

        {/* Cabeça */}
        <View style={[
          styles.head,
          dynamicStyles.head,
          { 
            backgroundColor: getPartColor('body', config.body),
          }
        ]} />

        {/* Cabelo */}
        <View style={[
          styles.hair,
          dynamicStyles.hair,
          { 
            backgroundColor: getPartColor('hair', config.hair),
          }
        ]} />

        {/* Olhos */}
        <Animated.View style={[
          styles.eyes,
          { 
            opacity: blinkAnim,
            transform: [{ scaleY: blinkAnim }]
          }
        ]}>
          <View style={[
            styles.eye,
            { backgroundColor: getPartColor('eyes', config.eyes) }
          ]} />
          <View style={[
            styles.eye,
            { backgroundColor: getPartColor('eyes', config.eyes) }
          ]} />
        </Animated.View>

        {/* Boca */}
        <View style={[
          styles.mouth,
          emotion === 'happy' && styles.mouthHappy,
          emotion === 'excited' && styles.mouthExcited,
        ]} />

        {/* Acessórios */}
        {config.accessories === 'accessory_glasses' && (
          <View style={styles.glasses}>
            <View style={styles.glassLens} />
            <View style={styles.glassBridge} />
            <View style={styles.glassLens} />
          </View>
        )}

        {config.accessories === 'accessory_crown' && (
          <View style={[styles.crown, dynamicStyles.crown]}>
            <Ionicons name="crown" size={size * 0.3} color="#ffd700" />
          </View>
        )}

        {config.accessories === 'accessory_halo' && (
          <View style={[styles.halo, dynamicStyles.halo]}>
            <Ionicons name="sunny" size={size * 0.4} color="#ffd700" />
          </View>
        )}

        {/* Efeitos especiais */}
        {isAnimating && (
          <>
            <View style={[styles.sparkle1, dynamicStyles.sparkle1]}>
              <Ionicons name="sparkles" size={size * 0.1} color="#00ff88" />
            </View>
            <View style={[styles.sparkle2, dynamicStyles.sparkle2]}>
              <Ionicons name="sparkles" size={size * 0.08} color="#45b7d1" />
            </View>
          </>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    backgroundColor: '#00ff88',
    opacity: 0.3,
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    position: 'absolute',
    bottom: '5%',
    borderRadius: 25,
    zIndex: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  clothes: {
    position: 'absolute',
    bottom: '10%',
    borderRadius: 20,
    zIndex: 2,
  },
  head: {
    position: 'absolute',
    bottom: '45%',
    borderRadius: 40,
    zIndex: 3,
  },
  hair: {
    position: 'absolute',
    bottom: '60%',
    borderRadius: 25,
    zIndex: 4,
  },
  eyes: {
    position: 'absolute',
    bottom: '52%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '30%',
    zIndex: 5,
  },
  eye: {
    width: '25%',
    height: '25%',
    borderRadius: 8,
  },
  mouth: {
    position: 'absolute',
    bottom: '45%',
    width: '15%',
    height: '4%',
    backgroundColor: '#ff6b6b',
    borderRadius: 4,
    zIndex: 5,
  },
  mouthHappy: {
    borderRadius: 8,
    height: '6%',
  },
  mouthExcited: {
    borderRadius: 12,
    height: '8%',
  },
  wings: {
    position: 'absolute',
    zIndex: 0,
    flexDirection: 'row',
  },
  wingLeft: {
    position: 'absolute',
    transform: [{ rotate: '-30deg' }],
  },
  wingRight: {
    position: 'absolute',
    transform: [{ rotate: '30deg' }],
  },
  glasses: {
    position: 'absolute',
    bottom: '55%',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 6,
  },
  glassLens: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#87ceeb',
    borderWidth: 1,
    borderColor: '#333',
  },
  glassBridge: {
    width: 6,
    height: 1,
    backgroundColor: '#333',
  },
  crown: {
    position: 'absolute',
    zIndex: 7,
  },
  halo: {
    position: 'absolute',
    zIndex: 0,
  },
  sparkle1: {
    position: 'absolute',
    zIndex: 9,
  },
  sparkle2: {
    position: 'absolute',
    zIndex: 9,
  },
});

export default AnimatedAvatar;