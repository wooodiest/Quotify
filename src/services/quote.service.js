/**
 * Quote Service - odpowiedzialny za zarządzanie cytatami
 * Łączy funkcjonalność API, bazy danych i lokalnego przechowywania
 */
import { ApiService } from './api.service';
import { DbService } from './db.service';
import { StorageService } from './storage.service';

export const QuoteService = {

  getQuoteOfDay: async () => {
    try {
      const storedQuoteOfDay = await StorageService.getItem('quoteOfDay');
      const today = new Date().toDateString();
      
      if (storedQuoteOfDay && storedQuoteOfDay.date === today) {
        return storedQuoteOfDay.quote;
      }
      
      if (navigator.onLine) {
        const quote = await ApiService.getQuoteOfDay(new Date());
        await DbService.saveQuote(quote);
        const quoteData = {
          quote,
          date: today
        };
        await StorageService.setItem('quoteOfDay', quoteData);      
        return quote;
      } else {
        const randomQuote = await DbService.getRandomQuote();
        if (randomQuote) {
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
  
  getRandomQuote: async () => {
    try {
      const storedRandomQuote = await StorageService.getItem('randomQuote');
      if (storedRandomQuote) {
        return storedRandomQuote;
      }
      
      if (navigator.onLine) {
        const quote = await ApiService.getRandomQuote();   
        await DbService.saveQuote(quote);
        await StorageService.setItem('randomQuote', quote);    
        return quote;
      } else {
        const randomQuote = await DbService.getRandomQuote();
        if (randomQuote) {
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
  
  refreshRandomQuote: async () => {
    try {
      if (navigator.onLine) {
        const quote = await ApiService.getRandomQuote();
        await DbService.saveQuote(quote);
        await StorageService.setItem('randomQuote', quote);  
        return quote;
      } else {
        const randomQuote = await DbService.getRandomQuote();
        if (randomQuote) {
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
  
  addToFavorites: async (quote) => {
    try {
      await DbService.saveQuote(quote);     
      await DbService.addToFavorites(quote.id);
    } catch (error) {
      console.error('Error adding quote to favorites:', error);
      throw error;
    }
  },
  
  removeFromFavorites: async (quoteId) => {
    try {
      await DbService.removeFromFavorites(quoteId);
    } catch (error) {
      console.error('Error removing quote from favorites:', error);
      throw error;
    }
  },
  
  getFavorites: async () => {
    try {
      return await DbService.getFavorites();
    } catch (error) {
      console.error('Error getting favorites:', error);
      throw error;
    }
  },
  
  isFavorite: async (quoteId) => {
    try {
      return await DbService.isFavorite(quoteId);
    } catch (error) {
      console.error('Error checking if quote is favorite:', error);
      return false;
    }
  },
  
  getAndCacheMultipleQuotes: async (limit = 30, forceRefresh = false) => {
    try {
      const quotesCount = await DbService.getQuotesCount();
      if (!forceRefresh && quotesCount >= limit) {
        return await DbService.getAllQuotes();
      }
      
      if (navigator.onLine) {
        const quotes = await ApiService.getMultipleQuotes(limit);
        await DbService.saveMultipleQuotes(quotes);
        
        await StorageService.setItem('lastQuotesCacheUpdate', {
          timestamp: Date.now(),
          count: quotes.length
        });
        
        return quotes;
      } else {
        const cachedQuotes = await DbService.getAllQuotes();    
        if (cachedQuotes.length > 0) {
          return cachedQuotes;
        }
        
        throw new Error('No cached quotes available and device is offline');
      }
    } catch (error) {
      console.error('Error getting and caching multiple quotes:', error);
      throw error;
    }
  },
  
  shouldRefreshQuotesCache: async (cacheMaxAge = 24 * 60 * 60 * 1000) => {
    try {
      const lastUpdate = await StorageService.getItem('lastQuotesCacheUpdate');
      if (!lastUpdate) return true;
      
      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdate.timestamp; 
      return timeSinceLastUpdate > cacheMaxAge;
    } catch (error) {
      console.error('Error checking if quotes cache should be refreshed:', error);
      return true;
    }
  }
};