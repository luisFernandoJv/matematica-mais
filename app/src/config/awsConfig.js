// src/config/awsConfig.js
export const AWS_CONFIG = {
  // URLs baseadas no ambiente
  API_BASE_URL: __DEV__ 
    ? 'https://eij6t4p9xi.execute-api.us-east-1.amazonaws.com/v1'
    : 'https://api.matematicaplus.ufersa.dev.br/v1',
  
  REGION: 'us-east-1',
  
  // Endpoints da API
  ENDPOINTS: {
    AUTH: '/auth',
    USERS: '/users',
    QUESTIONS: '/questions',
    WORLDS: '/worlds',
    RANKING: '/ranking',
    SHOP: '/shop',
    ACHIEVEMENTS: '/achievements'
  }
};
