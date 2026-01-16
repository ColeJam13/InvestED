import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/market';

export const marketService = {
  searchAssets: async (query, type = 'stock') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/search`, {
        params: { query, type }
      });
      // Log to see what we're getting
      console.log('Search response:', response.data);
      // Return the data directly since backend now returns correct format
      const searchData = response.data;
      if (searchData.result) {
        return {
          data: searchData.result.map(item => ({
            symbol: item.symbol,
            instrument_name: item.instrument_name || item.description,
            instrument_type: item.instrument_type || item.type || 'Stock',
            displaySymbol: item.displaySymbol || item.symbol
          }))
        };
      }
      return { data: [] };
    } catch (error) {
      console.error('Search error:', error);
      return { data: [] };
    }
  },

  getAssetQuote: async (symbol) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/quote`, {
        params: { symbol }
      });
      // Log to see what we're getting
      console.log('Finnhub quote response for', symbol, ':', response.data);
      
      const quote = response.data;
      
      // Check if we have valid data
      if (!quote || quote.c === undefined || quote.c === 0) {
        throw new Error('Invalid quote data received from Finnhub');
      }
      
      // Finnhub returns: { c: current, h: high, l: low, o: open, pc: prev close, t: timestamp }
      const currentPrice = quote.c;
      const previousClose = quote.pc || currentPrice; // Fallback if pc is missing
      const change = currentPrice - previousClose;
      const percentChange = previousClose !== 0 ? ((change / previousClose) * 100).toFixed(2) : '0.00';
      
      return {
        symbol: symbol,
        name: symbol, // Finnhub quote doesn't include name
        close: currentPrice.toFixed(2),
        open: (quote.o || 0).toFixed(2),
        high: (quote.h || 0).toFixed(2),
        low: (quote.l || 0).toFixed(2),
        previous_close: previousClose.toFixed(2),
        change: change.toFixed(2),
        percent_change: percentChange,
        volume: 'N/A', // Finnhub basic quote doesn't include volume
        timestamp: quote.t
      };
    } catch (error) {
      console.error('Quote fetch error:', error);
      throw error; // Re-throw so component can handle it
    }
  },

  getTrending: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/trending`);
      console.log('Trending response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Trending fetch error:', error);
      return [];
    }
  }
};