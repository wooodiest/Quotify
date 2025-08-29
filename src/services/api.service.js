/**
 * API Service - odpowiedzialny za komunikację z zewnętrznym API
 */
import axios from 'axios';

const API_URL = 'https://dummyjson.com/quotes';

export const ApiService = {
  /**
   * Pobiera losowy cytat z API
   * @returns {Promise<Object>} Obiekt cytatu
   */
  getRandomQuote: async () => {
    try {
      const response = await axios.get(`${API_URL}/random`);
      return response.data;
    } catch (error) {
      console.error('Error fetching random quote:', error);
      throw error;
    }
  },

  /**
   * Pobiera cytat o określonym ID
   * @param {number} id - ID cytatu do pobrania
   * @returns {Promise<Object>} Obiekt cytatu
   */
  getQuoteById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching quote with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Pobiera cytat dnia na podstawie daty
   * @param {Date} date - Data, dla której ma być pobrany cytat dnia
   * @returns {Promise<Object>} Obiekt cytatu
   */
  getQuoteOfDay: async (date) => {
    try {
      // Używamy daty do deterministycznego wyboru ID cytatu
      const dateString = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
      const hash = Array.from(dateString).reduce(
        (acc, char) => acc + char.charCodeAt(0), 0
      );
      
      // Zakładamy, że API ma 100 cytatów (od 1 do 100)
      const quoteId = (hash % 100) + 1;
      
      return await ApiService.getQuoteById(quoteId);
    } catch (error) {
      console.error('Error fetching quote of day:', error);
      // Jeśli nie udało się pobrać cytatu po ID, próbujemy pobrać losowy
      return await ApiService.getRandomQuote();
    }
  }
};