/**
 * Database Service - odpowiedzialny za operacje na bazie danych IndexedDB
 * Wykorzystuje bibliotekę Dexie
 */
import Dexie from 'dexie';

// Inicjalizacja bazy danych
const db = new Dexie('QuotifyDB');
db.version(1).stores({
  quotes: '++id,text,author,tags',
  favorites: '++id,quoteId'
});

export const DbService = {
  /**
   * Zapisuje cytat do bazy danych
   * @param {Object} quote - Obiekt cytatu do zapisania
   * @returns {Promise<number>} ID zapisanego cytatu
   */
  saveQuote: async (quote) => {
    try {
      return await db.quotes.put(quote);
    } catch (error) {
      console.error('Error saving quote to database:', error);
      throw error;
    }
  },

  /**
   * Pobiera cytat z bazy danych po ID
   * @param {number} id - ID cytatu do pobrania
   * @returns {Promise<Object>} Obiekt cytatu lub undefined jeśli nie znaleziono
   */
  getQuoteById: async (id) => {
    try {
      return await db.quotes.get(id);
    } catch (error) {
      console.error(`Error getting quote with id ${id} from database:`, error);
      throw error;
    }
  },

  /**
   * Pobiera wszystkie cytaty z bazy danych
   * @returns {Promise<Array>} Tablica cytatów
   */
  getAllQuotes: async () => {
    try {
      return await db.quotes.toArray();
    } catch (error) {
      console.error('Error getting all quotes from database:', error);
      throw error;
    }
  },

  /**
   * Dodaje cytat do ulubionych
   * @param {number} quoteId - ID cytatu do dodania do ulubionych
   * @returns {Promise<number>} ID zapisanego wpisu ulubionych
   */
  addToFavorites: async (quoteId) => {
    try {
      return await db.favorites.put({ quoteId });
    } catch (error) {
      console.error(`Error adding quote ${quoteId} to favorites:`, error);
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
      await db.favorites.where({ quoteId }).delete();
    } catch (error) {
      console.error(`Error removing quote ${quoteId} from favorites:`, error);
      throw error;
    }
  },

  /**
   * Pobiera wszystkie ulubione cytaty
   * @returns {Promise<Array>} Tablica ulubionych cytatów
   */
  getFavorites: async () => {
    try {
      const storedFavorites = await db.favorites.toArray();
      const favoriteQuotes = await Promise.all(
        storedFavorites.map(async (fav) => {
          return await db.quotes.get(fav.quoteId);
        })
      );
      return favoriteQuotes.filter(Boolean);
    } catch (error) {
      console.error('Error getting favorites from database:', error);
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
      const count = await db.favorites.where({ quoteId }).count();
      return count > 0;
    } catch (error) {
      console.error(`Error checking if quote ${quoteId} is favorite:`, error);
      throw error;
    }
  },

  /**
   * Pobiera losowy cytat z bazy danych
   * @returns {Promise<Object>} Losowy cytat lub null jeśli baza jest pusta
   */
  getRandomQuote: async () => {
    try {
      const quotes = await db.quotes.toArray();
      if (quotes.length === 0) return null;
      
      const randomIndex = Math.floor(Math.random() * quotes.length);
      return quotes[randomIndex];
    } catch (error) {
      console.error('Error getting random quote from database:', error);
      throw error;
    }
  }
};

// Eksportujemy instancję bazy danych dla zaawansowanych przypadków użycia
export { db };