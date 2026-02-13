import { AWS_CONFIG } from '../config/awsConfig';

class AwsApiService {
  constructor() {
    this.baseURL = AWS_CONFIG.API_BASE_URL;
    this.token = null;
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      };
      if (this.token) {
        config.headers['Authorization'] = `Bearer ${this.token}`;
      }

      if (data && (method === 'POST' || method === 'PUT')) {
        config.body = JSON.stringify(data);
      }

      console.log(`🔗 ${method} ${url}`);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('❌ Erro na requisição AWS:', error);
      throw error;
    }
  }

  // Autenticação
  async authenticate(email, password) {
    const result = await this.makeRequest('/auth/login', 'POST', {
      email,
      password
    });
    
    if (result.token) {
      this.token = result.token;
    }
    
    return result;
  }

  // Usuários
  async registerUser(userData) {
    return this.makeRequest('/auth/register', 'POST', userData);
  }

  async getUserProfile(userId) {
    return this.makeRequest(`/users/${userId}`);
  }

  async updateUserProgress(userId, progressData) {
    return this.makeRequest(`/users/${userId}/progress`, 'PUT', progressData);
  }

  async addCoins(userId, coins) {
    return this.makeRequest(`/users/${userId}/coins`, 'POST', { coins });
  }

  // Questões
  async getWorlds() {
    return this.makeRequest('/worlds');
  }

  async getQuestions(worldId, level = 1) {
    return this.makeRequest(`/questions/${worldId}?level=${level}`);
  }

  async submitQuizResult(quizData) {
    return this.makeRequest('/quiz/results', 'POST', quizData);
  }

  // Ranking
  async getGlobalRanking(limit = 50) {
    return this.makeRequest(`/ranking?limit=${limit}`);
  }

  // Loja
  async getShopItems() {
    return this.makeRequest('/shop/items');
  }

  async purchaseItem(userId, itemId) {
    return this.makeRequest('/shop/purchase', 'POST', { userId, itemId });
  }

  // Conquistas
  async getUserAchievements(userId) {
    return this.makeRequest(`/achievements/${userId}`);
  }

  setAuthToken(token) {
    this.token = token;
  }
}

export const awsApiService = new AwsApiService();