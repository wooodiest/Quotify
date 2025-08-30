import Dexie from 'dexie';

const db = new Dexie('QuotifyDB');
db.version(1).stores({
  quotes: '++id,text,author,tags',
  favorites: '++id,quoteId'
});

export const DbService = {

  saveQuote: async (quote) => {
    try {
      return await db.quotes.put(quote);
    } catch (error) {
      console.error('Error saving quote to database:', error);
      throw error;
    }
  },
  
  saveMultipleQuotes: async (quotes) => {
    try {
      return await db.quotes.bulkPut(quotes);
    } catch (error) {
      console.error('Error saving multiple quotes to database:', error);
      throw error;
    }
  },

  getQuoteById: async (id) => {
    try {
      return await db.quotes.get(id);
    } catch (error) {
      console.error(`Error getting quote with id ${id} from database:`, error);
      throw error;
    }
  },
  getAllQuotes: async () => {
    try {
      return await db.quotes.toArray();
    } catch (error) {
      console.error('Error getting all quotes from database:', error);
      throw error;
    }
  },

  addToFavorites: async (quoteId) => {
    try {
      return await db.favorites.put({ quoteId });
    } catch (error) {
      console.error(`Error adding quote ${quoteId} to favorites:`, error);
      throw error;
    }
  },

  removeFromFavorites: async (quoteId) => {
    try {
      await db.favorites.where({ quoteId }).delete();
    } catch (error) {
      console.error(`Error removing quote ${quoteId} from favorites:`, error);
      throw error;
    }
  },

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

  isFavorite: async (quoteId) => {
    try {
      const count = await db.favorites.where({ quoteId }).count();
      return count > 0;
    } catch (error) {
      console.error(`Error checking if quote ${quoteId} is favorite:`, error);
      throw error;
    }
  },

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
  },
  
  getQuotesCount: async () => {
    try {
      return await db.quotes.count();
    } catch (error) {
      console.error('Error getting quotes count from database:', error);
      throw error;
    }
  }
};

export { db };