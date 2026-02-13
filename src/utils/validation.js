// src/utils/validation.js
import { AVAILABLE_SCHOOLS } from '../constants/constants.js';

// Lista de palavras proibidas (simplificada)
const PROHIBITED_WORDS = [
  "porra", "caralho", "merda", "cu", "buceta", "puta", "viado",
  "fdp", "pqp", "vsf", "foda", "foder", "cacete", "piranha",
  "vagabunda", "vagabundo", "otário", "idiota", "imbecil", "babaca",
  "corno", "arrombado", "bosta", "lixo", "escroto", "vtnc"
];

// Função para verificar se o nome contém palavras proibidas
export const containsProhibitedWords = (name) => {
  if (!name) return false;
  
  const normalizedName = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

  return PROHIBITED_WORDS.some(word => {
    const normalizedWord = word
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
    return normalizedName.includes(normalizedWord);
  });
};

// Função para validar se o nome é válido
export const isValidName = (name) => {
  if (!name || typeof name !== "string") return false;
  
  const trimmedName = name.trim();
  
  // Verificar comprimento mínimo e máximo
  if (trimmedName.length < 3 || trimmedName.length > 50) return false;
  
  // Verificar se contém apenas letras, espaços e acentos
  const nameRegex = /^[a-zA-ZÀ-ÿ\s]{3,50}$/;
  if (!nameRegex.test(trimmedName)) return false;
  
  // Verificar palavras proibidas
  if (containsProhibitedWords(trimmedName)) return false;
  
  return true;
};

// Função para validar idade
export const isValidAge = (age) => {
  const ageNum = parseInt(age);
  return !isNaN(ageNum) && ageNum >= 6 && ageNum <= 18;
};

// Função para validar escola
export const isValidSchool = (school) => {
  return school && school.trim().length > 0 && AVAILABLE_SCHOOLS.includes(school);
};

// Função para validar tipo de usuário
export const isValidUserType = (userType) => {
  return userType === 'student' || userType === 'teacher';
};

// Função para validar pontuação
export const isValidScore = (score) => {
  const scoreNum = parseInt(score);
  return !isNaN(scoreNum) && scoreNum >= 0;
};

// Função para validar tempo de resposta
export const isValidResponseTime = (time) => {
  const timeNum = parseInt(time);
  return !isNaN(timeNum) && timeNum >= 0;
};

// Função para validar nível RPG
export const isValidLevel = (level) => {
  const levelNum = parseInt(level);
  return !isNaN(levelNum) && levelNum >= 0;
};

// Função para validar conquistas
export const isValidAchievements = (achievements) => {
  return Array.isArray(achievements) && achievements.every(achievement => 
    typeof achievement === 'object' && 
    achievement.hasOwnProperty('icon') && 
    achievement.hasOwnProperty('name') && 
    achievement.hasOwnProperty('desc')
  );
};

// Função para validar dados completos do usuário
export const isValidUserData = (userData) => {
  if (!userData || typeof userData !== 'object') return false;
  
  const requiredFields = ['name', 'age', 'school', 'userType'];
  const hasRequiredFields = requiredFields.every(field => 
    userData.hasOwnProperty(field) && userData[field]
  );
  
  if (!hasRequiredFields) return false;
  
  return isValidName(userData.name) && 
         isValidAge(userData.age) && 
         isValidSchool(userData.school) && 
         isValidUserType(userData.userType);
};

// Função para sanitizar entrada de texto
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .substring(0, 255);
};

// Função para validar email (para professores)
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Função para validar senha (para professores)
export const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  
  return password.length >= 6 && password.length <= 128;
};