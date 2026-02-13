// src/constants/constants.js
// Configurações do aplicativo com tema RPG
export const APP_CONFIG = {
  // Limites de tempo para diferentes tipos de resposta (em segundos)
  SPEED_THRESHOLDS: {
    VERY_FAST: 8,
    FAST: 15,
    NORMAL: 30,
    SLOW: 45,
    VERY_SLOW: 60,
  },

  // Sistema de bônus RPG (redução de tempo em segundos)
  BONUSES: {
    SPEED_BONUS: 8,
    THREE_CONSECUTIVE: 15,
    FIVE_CONSECUTIVE: 25,
    SEVEN_CONSECUTIVE: 35,
    PERFECT_STREAK: 50,
    COMEBACK_BONUS: 12,
    FIRST_TRY: 5,
  },

  // Sistema de penalidades RPG (aumento de tempo em segundos)
  PENALTIES: {
    TWO_CONSECUTIVE_ERRORS: 25,
    THREE_CONSECUTIVE_ERRORS: 40,
    SLOW_RESPONSE: 15,
    MULTIPLE_ATTEMPTS: 10,
  },

  QUESTION_TIME_LIMIT: 90,

  LEVELS: {
    NOVICE: { min: 0, max: 2, title: "🌱 Aprendiz", color: "green" },
    APPRENTICE: { min: 3, max: 5, title: "⚔️ Guerreiro", color: "blue" },
    WARRIOR: { min: 6, max: 8, title: "🔥 Mago", color: "purple" },
    MASTER: { min: 9, max: 12, title: "👑 Mestre", color: "gold" },
    LEGEND: { min: 13, max: 999, title: "🌟 Lenda", color: "rainbow" },
  },

  ACHIEVEMENTS: {
    SPEED_DEMON: { icon: "⚡", name: "Demônio da Velocidade", desc: "5 respostas em menos de 10s" },
    PERFECTIONIST: { icon: "💎", name: "Perfeccionista", desc: "100% de acertos" },
    COMEBACK_KING: { icon: "🔥", name: "Rei do Retorno", desc: "3 recuperações após erros" },
    STREAK_MASTER: { icon: "🌟", name: "Mestre das Sequências", desc: "Sequência de 10 acertos" },
    KNOWLEDGE_SEEKER: { icon: "📚", name: "Buscador do Conhecimento", desc: "Complete 5 quizzes" },
  },
};

// Mensagens de feedback com tema RPG
export const FEEDBACK_MESSAGES = {
  CORRECT: [
    "🎯 Acerto Épico!",
    "⚔️ Golpe Certeiro!",
    "🔥 Poder Mágico!",
    "💎 Brilhante!",
    "🌟 Fantástico!",
    "🏆 Campeão!",
    "⚡ Incrível!",
    "🎊 Perfeito!",
  ],
  INCORRECT: [
    "🛡️ Não desista, guerreiro!",
    "📚 Estude mais, jovem aprendiz!",
    "🔄 Tente novamente, aventureiro!",
    "💪 Você consegue!",
    "🎯 Quase lá!",
    "🌱 Aprendendo sempre!",
    "⭐ Continue tentando!",
    "🚀 Rumo à vitória!",
  ],
  BONUS: {
    SPEED_BONUS: [
      "⚡ Velocidade Ninja! Bônus de tempo concedido!",
      "🏃‍♂️ Corrida Relâmpago! Tempo reduzido!",
      "💨 Vento Veloz! Bônus conquistado!",
    ],
    THREE_CONSECUTIVE: [
      "🔥 Combo de Fogo! 3 acertos em sequência!",
      "⚔️ Sequência de Guerreiro! Bônus desbloqueado!",
      "🎯 Precisão Tripla! Tempo reduzido!",
    ],
    FIVE_CONSECUTIVE: [
      "⚡ Combo de Raio! 5 acertos seguidos!",
      "🌟 Sequência Estelar! Poder mágico ativado!",
      "🔥 Chama Ardente! Bônus épico!",
    ],
    SEVEN_CONSECUTIVE: [
      "🐉 Combo de Dragão! 7 acertos consecutivos!",
      "👑 Sequência Real! Poder lendário!",
      "💎 Perfeição Cristalina! Bônus supremo!",
    ],
    PERFECT_STREAK: [
      "🌟 COMBO LENDÁRIO! Sequência perfeita!",
      "👑 MESTRE SUPREMO! Poder divino ativado!",
      "💫 TRANSCENDÊNCIA! Bônus mítico!",
    ],
    COMEBACK_BONUS: [
      "🔥 Espírito de Fênix! Ressurgiu das cinzas!",
      "💪 Força de Vontade! Recuperação épica!",
      "⭐ Determinação! Bônus de retorno!",
    ],
  },
  PENALTY: {
    TWO_CONSECUTIVE_ERRORS: [
      "😰 Maldição Menor ativada! Cuidado, aventureiro!",
      "⚠️ Névoa da Confusão! Tempo aumentado!",
      "🌪️ Vento Contrário! Penalidade aplicada!",
    ],
    THREE_CONSECUTIVE_ERRORS: [
      "😱 Maldição Maior! O tempo escorre mais rápido!",
      "🌑 Sombras do Erro! Penalidade severa!",
      "⛈️ Tempestade Mental! Concentre-se!",
    ],
    SLOW_RESPONSE: [
      "🐌 Maldição da Tartaruga! Acelere o pensamento!",
      "⏰ Tempo Pesado! Pense mais rápido!",
      "🕰️ Relógio Maldito! Penalidade de lentidão!",
    ],
  },
};

// Escolas disponíveis
export const AVAILABLE_SCHOOLS = [
  "🏰 E.M.E.F Lica Duarte",
  "⚔️ E.M.E.F Benevenuto Mariano",
  "🌟 E.M.E.F Francisca Gomes",
];

// Sistema de ranking RPG
export const RANKING_SYSTEM = {
  TITLES: [
    { min: 0, max: 0, title: "🌱 Iniciante", color: "#22c55e" },
    { min: 1, max: 3, title: "⚔️ Aprendiz", color: "#3b82f6" },
    { min: 4, max: 6, title: "🛡️ Guerreiro", color: "#8b5cf6" },
    { min: 7, max: 9, title: "🔥 Mago", color: "#f59e0b" },
    { min: 10, max: 12, title: "💎 Mestre", color: "#ef4444" },
    { min: 13, max: 15, title: "👑 Grão-Mestre", color: "#ec4899" },
    { min: 16, max: 999, title: "🌟 Lenda Viva", color: "#10b981" },
  ],
};

// Tipos de usuário
export const USER_TYPES = {
  STUDENT: "student",
  TEACHER: "teacher",
};
