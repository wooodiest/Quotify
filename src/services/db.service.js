import Dexie from 'dexie';

const db = new Dexie('QuotifyDB');
db.version(1).stores({
  quotes: '++id,text,author,tags,userId',
  favorites: '++id,quoteId,userId'
});

export const DbService = {

  saveQuote: async (userId, quote) => {
    try {
      return await db.quotes.put({ ...quote, userId });
    } catch (error) {
      console.error('Error saving quote to database:', error);
      throw error;
    }
  },
  
  saveMultipleQuotes: async (userId, quotes) => {
    try {
      const quotesWithUser = quotes.map(q => ({ ...q, userId }));
      return await db.quotes.bulkPut(quotesWithUser);
    } catch (error) {
      console.error('Error saving multiple quotes to database:', error);
      throw error;
    }
  },

  getQuoteById: async (userId, id) => {
    try {
      return await db.quotes.get({ id, userId });
    } catch (error) {
      console.error(`Error getting quote with id ${id} from database:`, error);
      throw error;
    }
  },

  getAllQuotes: async (userId) => {
    try {
      return await db.quotes.where('userId').equals(userId).toArray();
    } catch (error) {
      console.error('Error getting all quotes from database:', error);
      throw error;
    }
  },

  addToFavorites: async (userId, quoteId) => {
    try {
      return await db.favorites.put({ quoteId, userId });
    } catch (error) {
      console.error(`Error adding quote ${quoteId} to favorites:`, error);
      throw error;
    }
  },

  removeFromFavorites: async (userId, quoteId) => {
    try {
      await db.favorites.where({ quoteId, userId }).delete();
    } catch (error) {
      console.error(`Error removing quote ${quoteId} from favorites:`, error);
      throw error;
    }
  },

  getFavorites: async (userId) => {
    try {
      const storedFavorites = await db.favorites.where('userId').equals(userId).toArray();
      const favoriteQuotes = await Promise.all(
        storedFavorites.map(async (fav) => {
          return await db.quotes.get({ id: fav.quoteId, userId });
        })
      );
      return favoriteQuotes.filter(Boolean);
    } catch (error) {
      console.error('Error getting favorites from database:', error);
      throw error;
    }
  },

  isFavorite: async (userId, quoteId) => {
    try {
      const count = await db.favorites.where({ quoteId, userId }).count();
      return count > 0;
    } catch (error) {
      console.error(`Error checking if quote ${quoteId} is favorite:`, error);
      throw error;
    }
  },

  getRandomQuote: async (userId) => {
    try {
      const quotes = await db.quotes.where('userId').equals(userId).toArray();
      if (quotes.length === 0) return null;
      
      const randomIndex = Math.floor(Math.random() * quotes.length);
      return quotes[randomIndex];
    } catch (error) {
      console.error('Error getting random quote from database:', error);
      throw error;
    }
  },
  
  getQuotesCount: async (userId) => {
    try {
      return await db.quotes.where('userId').equals(userId).count();
    } catch (error) {
      console.error('Error getting quotes count from database:', error);
      throw error;
    }
  }
};

export { db };
