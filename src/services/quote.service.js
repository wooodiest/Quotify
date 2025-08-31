import { ApiService } from './api.service';
import { DbService } from './db.service';
import { StorageService } from './storage.service';

export const QuoteService = {
  getQuoteOfDay: async (userId) => {
    try {
      const storedQuoteOfDay = await StorageService.getItem('quoteOfDay', userId);
      const today = new Date().toDateString();

      if (storedQuoteOfDay && storedQuoteOfDay.date === today) {
        return storedQuoteOfDay.quote;
      }

      if (navigator.onLine) {
        const quote = await ApiService.getQuoteOfDay(new Date());
        await DbService.saveQuote(userId, quote);
        const quoteData = { quote, date: today };
        await StorageService.setItem('quoteOfDay', quoteData, userId);
        return quote;
      } else {
        const randomQuote = await DbService.getRandomQuote(userId);
        if (randomQuote) {
          const quoteData = { quote: randomQuote, date: today };
          await StorageService.setItem('quoteOfDay', quoteData, userId);
          return randomQuote;
        }
        throw new Error('No cached quotes available');
      }
    } catch (error) {
      console.error('Error getting quote of day:', error);
      throw error;
    }
  },

  getRandomQuote: async (userId) => {
    try {
      const storedRandomQuote = await StorageService.getItem('randomQuote', userId);
      if (storedRandomQuote) {
        return storedRandomQuote;
      }

      if (navigator.onLine) {
        const quote = await ApiService.getRandomQuote();
        await DbService.saveQuote(quote);
        await StorageService.setItem('randomQuote', quote, userId);
        return quote;
      } else {
        const randomQuote = await DbService.getRandomQuote(userId);
        if (randomQuote) {
          await StorageService.setItem('randomQuote', randomQuote, userId);
          return randomQuote;
        }
        throw new Error('No cached quotes available');
      }
    } catch (error) {
      console.error('Error getting random quote:', error);
      throw error;
    }
  },

  refreshRandomQuote: async (userId) => {
    try {
      if (navigator.onLine) {
        const quote = await ApiService.getRandomQuote();
        await DbService.saveQuote(userId, quote);
        await StorageService.setItem('randomQuote', quote, userId);
        return quote;
      } else {
        const randomQuote = await DbService.getRandomQuote(userId);
        if (randomQuote) {
          await StorageService.setItem('randomQuote', randomQuote, userId);
          return randomQuote;
        }
        throw new Error('No cached quotes available');
      }
    } catch (error) {
      console.error('Error refreshing random quote:', error);
      throw error;
    }
  },

  addToFavorites: async (userId, quote) => {
    try {
      await DbService.saveQuote(userId, quote);
      await DbService.addToFavorites(userId, quote.id);
    } catch (error) {
      console.error('Error adding quote to favorites:', error);
      throw error;
    }
  },

  removeFromFavorites: async (userId, quoteId) => {
    try {
      await DbService.removeFromFavorites(userId, quoteId);
    } catch (error) {
      console.error('Error removing quote from favorites:', error);
      throw error;
    }
  },

  getFavorites: async (userId) => {
    try {
      return await DbService.getFavorites(userId);
    } catch (error) {
      console.error('Error getting favorites:', error);
      throw error;
    }
  },

  isFavorite: async (userId, quoteId) => {
    try {
      return await DbService.isFavorite(userId, quoteId);
    } catch (error) {
      console.error('Error checking if quote is favorite:', error);
      return false;
    }
  },

  getAndCacheMultipleQuotes: async (userId, limit = 30, forceRefresh = false) => {
    try {
      const quotesCount = await DbService.getQuotesCount(userId);
      if (!forceRefresh && quotesCount >= limit) {
        return await DbService.getAllQuotes(userId);
      }

      if (navigator.onLine) {
        const quotes = await ApiService.getQuotes(limit);
        await DbService.saveMultipleQuotes(userId, quotes);

        await StorageService.setItem('lastQuotesCacheUpdate', {
          timestamp: Date.now(),
          count: quotes.length
        }, userId);

        return quotes;
      } else {
        const cachedQuotes = await DbService.getAllQuotes(userId);
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

  shouldRefreshQuotesCache: async (userId, cacheMaxAge = 24 * 60 * 60 * 1000) => {
    try {
      const lastUpdate = await StorageService.getItem('lastQuotesCacheUpdate', userId);
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
