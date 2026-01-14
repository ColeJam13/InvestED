import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const portfolioService = {
  // Get user info
  getUser: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Get portfolio summary (total value, cash, gain/loss with real-time prices)
  getPortfolioSummary: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/portfolios/user/${userId}/summary`);
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio summary:', error);
      throw error;
    }
  },

  // Get all positions across all portfolios with real-time prices
  getAllPositions: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/portfolios/user/${userId}/all-positions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching positions:', error);
      throw error;
    }
  },

  // Get user's risk profile  
  getRiskProfile: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/risk-profiles/user/${userId}`);
      return response.data;
    } catch (error) {
      // If endpoint doesn't exist or returns 404/405, just return null
      console.log('Risk profile endpoint not available, using default');
      return null;
    }
  },

  // Update user's risk profile
  updateRiskProfile: async (userId, riskData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/risk-profiles/user/${userId}`, riskData);
      return response.data;
    } catch (error) {
      console.error('Error updating risk profile:', error);
      // Just log and continue - risk profile is optional
      return null;
    }
  },

  // Helper formatters
  formatCurrency: (amount) => {
    if (amount === null || amount === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  },

  formatPercent: (value) => {
    if (value === null || value === undefined) return '0.00%';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${parseFloat(value).toFixed(2)}%`;
  }
};