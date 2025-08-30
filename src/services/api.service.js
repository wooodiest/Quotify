import axios from 'axios';

const API_URL = 'https://dummyjson.com/quotes';

export const ApiService = {

  getRandomQuote: async () => {
    try {
      const response = await axios.get(`${API_URL}/random`);
      return response.data;
    } catch (error) {
      console.error('Error fetching random quote:', error);
      throw error;
    }
  },

  getQuoteById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching quote with id ${id}:`, error);
      throw error;
    }
  },

  getQuoteOfDay: async (date = new Date()) => {
    try {
      let total = 100;
      try {
        const response = await axios.get(`${API_URL}?limit=1`);
        total =  response.data.total;
      } catch (error) {
        console.error('Error fetching quote count:', error);
      }

      const dateString = date.toISOString().split('T')[0];
      const daySeed = new Date(dateString).getTime();

      const quoteId = (daySeed % total) + 1;
      return await ApiService.getQuoteById(quoteId);
    } catch (error) {
      console.error('Error fetching quote of day:', error);
      return await ApiService.getRandomQuote();
    }
  },

  getQuotes: async (limit = 30) => {
    try {
      const response = await axios.get(`${API_URL}?limit=${limit}`);
      return response.data.quotes;
    } catch (error) {
      console.error(`Error fetching multiple quotes (limit: ${limit}:`, error);
      throw error;
    }
  }
};