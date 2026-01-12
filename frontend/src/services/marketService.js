import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/market';

export const marketService = {
  searchAssets: async (query) => {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { query }
    });
    return response.data;
  },

  getAssetPrice: async (symbol) => {
    const response = await axios.get(`${API_BASE_URL}/price/${symbol}`);
    return response.data;
  },

  getAssetQuote: async (symbol) => {
    const response = await axios.get(`${API_BASE_URL}/quote`, {
      params: { symbol }
    });
    return response.data;
  }
};