/**
 * Quote Service - odpowiedzialny za zarządzanie cytatami
 * Łączy funkcjonalność API, bazy danych i lokalnego przechowywania
 */
import { ApiService } from './api.service';
import { DbService } from './db.service';
import { StorageService } from './storage.service';

export const QuoteService = {
  /**
   * Pobiera cytat dnia
   * @returns {Promise<Object>} Obiekt cytatu dnia
   */
  getQuoteOfDay: async () => {
    try {
      // Sprawdź, czy mamy zapisany cytat dnia
      const storedQuoteOfDay = await StorageService.getItem('quoteOfDay');
      const today = new Date().toDateString();
      
      // Jeśli mamy zapisany cytat dnia i jest aktualny, zwróć go
      if (storedQuoteOfDay && storedQuoteOfDay.date === today) {
        return storedQuoteOfDay.quote;
      }
      
      // Jeśli jesteśmy online, pobierz nowy cytat dnia
      if (navigator.onLine) {
        const quote = await ApiService.getQuoteOfDay(new Date());
        
        // Zapisz cytat w bazie danych
        await DbService.saveQuote(quote);
        
        // Zapisz jako cytat dnia z datą
        const quoteData = {
          quote,
          date: today
        };
        await StorageService.setItem('quoteOfDay', quoteData);
        
        return quote;
      } else {
        // Jeśli jesteśmy offline, użyj losowego cytatu z bazy danych
        const randomQuote = await DbService.getRandomQuote();
        if (randomQuote) {
          // Zapisz jako cytat dnia z datą
          const quoteData = {
            quote: randomQuote,
            date: today
          };
          await StorageService.setItem('quoteOfDay', quoteData);
          
          return randomQuote;
        }
        throw new Error('No cached quotes available');
      }
    } catch (error) {
      console.error('Error getting quote of day:', error);
      throw error;
    }
  },
  
  /**
   * Pobiera losowy cytat
   * @returns {Promise<Object>} Obiekt losowego cytatu
   */
  getRandomQuote: async () => {
    try {
      // Sprawdź, czy mamy zapisany losowy cytat
      const storedRandomQuote = await StorageService.getItem('randomQuote');
      
      // Jeśli mamy zapisany losowy cytat, zwróć go
      if (storedRandomQuote) {
        return storedRandomQuote;
      }
      
      // Jeśli jesteśmy online, pobierz nowy losowy cytat
      if (navigator.onLine) {
        const quote = await ApiService.getRandomQuote();
        
        // Zapisz cytat w bazie danych
        await DbService.saveQuote(quote);
        
        // Zapisz jako losowy cytat
        await StorageService.setItem('randomQuote', quote);
        
        return quote;
      } else {
        // Jeśli jesteśmy offline, użyj losowego cytatu z bazy danych
        const randomQuote = await DbService.getRandomQuote();
        if (randomQuote) {
          // Zapisz jako losowy cytat
          await StorageService.setItem('randomQuote', randomQuote);
          
          return randomQuote;
        }
        throw new Error('No cached quotes available');
      }
    } catch (error) {
      console.error('Error getting random quote:', error);
      throw error;
    }
  },
  
  /**
   * Odświeża losowy cytat
   * @returns {Promise<Object>} Obiekt nowego losowego cytatu
   */
  refreshRandomQuote: async () => {
    try {
      // Jeśli jesteśmy online, pobierz nowy losowy cytat
      if (navigator.onLine) {
        const quote = await ApiService.getRandomQuote();
        
        // Zapisz cytat w bazie danych
        await DbService.saveQuote(quote);
        
        // Zapisz jako losowy cytat
        await StorageService.setItem('randomQuote', quote);
        
        return quote;
      } else {
        // Jeśli jesteśmy offline, użyj losowego cytatu z bazy danych
        const randomQuote = await DbService.getRandomQuote();
        if (randomQuote) {
          // Zapisz jako losowy cytat
          await StorageService.setItem('randomQuote', randomQuote);
          
          return randomQuote;
        }
        throw new Error('No cached quotes available');
      }
    } catch (error) {
      console.error('Error refreshing random quote:', error);
      throw error;
    }
  },
  
  /**
   * Dodaje cytat do ulubionych
   * @param {Object} quote - Obiekt cytatu do dodania do ulubionych
   * @returns {Promise<void>}
   */
  addToFavorites: async (quote) => {
    try {
      // Zapisz cytat w bazie danych, jeśli jeszcze nie istnieje
      await DbService.saveQuote(quote);
      
      // Dodaj do ulubionych
      await DbService.addToFavorites(quote.id);
    } catch (error) {
      console.error('Error adding quote to favorites:', error);
      throw error;
    }
  },
  
  /**
   * Usuwa cytat z ulubionych
   * @param {number} quoteId - ID cytatu do usunięcia z ulubionych
   * @returns {Promise<void>}
   */
  removeFromFavorites: async (quoteId) => {
    try {
      await DbService.removeFromFavorites(quoteId);
    } catch (error) {
      console.error('Error removing quote from favorites:', error);
      throw error;
    }
  },
  
  /**
   * Pobiera wszystkie ulubione cytaty
   * @returns {Promise<Array>} Tablica ulubionych cytatów
   */
  getFavorites: async () => {
    try {
      return await DbService.getFavorites();
    } catch (error) {
      console.error('Error getting favorites:', error);
      throw error;
    }
  },
  
  /**
   * Sprawdza, czy cytat jest w ulubionych
   * @param {number} quoteId - ID cytatu do sprawdzenia
   * @returns {Promise<boolean>} True jeśli cytat jest w ulubionych, false w przeciwnym razie
   */
  isFavorite: async (quoteId) => {
    try {
      return await DbService.isFavorite(quoteId);
    } catch (error) {
      console.error('Error checking if quote is favorite:', error);
      return false;
    }
  }
};