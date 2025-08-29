import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Dexie from 'dexie';

// Initialize IndexedDB using Dexie
const db = new Dexie('QuotifyDB');
db.version(1).stores({
  quotes: '++id,text,author,tags',
  favorites: '++id,quoteId'
});

const QuoteContext = createContext();

export const useQuotes = () => useContext(QuoteContext);

export const QuoteProvider = ({ children }) => {
  const [quoteOfDay, setQuoteOfDay] = useState(null);
  const [randomQuote, setRandomQuote] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load favorites from IndexedDB
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await db.favorites.toArray();
        const favoriteQuotes = await Promise.all(
          storedFavorites.map(async (fav) => {
            return await db.quotes.get(fav.quoteId);
          })
        );
        setFavorites(favoriteQuotes.filter(Boolean));
      } catch (err) {
        console.error('Error loading favorites:', err);
      }
    };

    loadFavorites();
  }, []);

  // Load quote of the day
  useEffect(() => {
    const loadQuoteOfDay = async () => {
      try {
        // Check if we already have a quote of the day stored and it's from today
        const storedQuoteOfDay = await window.electronAPI.store.get('quoteOfDay');
        const today = new Date().toDateString();
        
        if (storedQuoteOfDay && storedQuoteOfDay.date === today) {
          setQuoteOfDay(storedQuoteOfDay.quote);
          return;
        }
        
        // If online, fetch a new quote of the day
        if (isOnline) {
          await fetchQuoteOfDay();
        } else {
          // If offline, use a random quote from the cache
          const cachedQuotes = await db.quotes.toArray();
          if (cachedQuotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * cachedQuotes.length);
            setQuoteOfDay(cachedQuotes[randomIndex]);
          }
        }
      } catch (err) {
        console.error('Error loading quote of the day:', err);
      }
    };

    loadQuoteOfDay();
  }, [isOnline]);

  const fetchQuoteOfDay = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('https://dummyjson.com/quotes/random');
      const quote = response.data;
      
      // Store in IndexedDB
      await db.quotes.put(quote);
      
      // Store as quote of the day with date
      await window.electronAPI.store.set('quoteOfDay', {
        quote,
        date: new Date().toDateString()
      });
      
      setQuoteOfDay(quote);
      return quote;
    } catch (err) {
      setError('Failed to fetch quote of the day');
      console.error('Error fetching quote of the day:', err);
      
      // Try to get a random quote from cache if online fetch fails
      const cachedQuotes = await db.quotes.toArray();
      if (cachedQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * cachedQuotes.length);
        setQuoteOfDay(cachedQuotes[randomIndex]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomQuote = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (isOnline) {
        const response = await axios.get('https://dummyjson.com/quotes/random');
        const quote = response.data;
        
        // Store in IndexedDB
        await db.quotes.put(quote);
        
        setRandomQuote(quote);
        return quote;
      } else {
        // If offline, use a random quote from the cache
        const cachedQuotes = await db.quotes.toArray();
        if (cachedQuotes.length > 0) {
          const randomIndex = Math.floor(Math.random() * cachedQuotes.length);
          setRandomQuote(cachedQuotes[randomIndex]);
          return cachedQuotes[randomIndex];
        } else {
          throw new Error('No cached quotes available');
        }
      }
    } catch (err) {
      setError('Failed to fetch random quote');
      console.error('Error fetching random quote:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (quote) => {
    try {
      // Store the quote if it's not already in the database
      const existingQuote = await db.quotes.get({ id: quote.id });
      if (!existingQuote) {
        await db.quotes.put(quote);
      }
      
      // Add to favorites
      await db.favorites.put({ quoteId: quote.id });
      
      // Update state
      setFavorites(prev => [...prev, quote]);
    } catch (err) {
      console.error('Error adding to favorites:', err);
    }
  };

  const removeFromFavorites = async (quoteId) => {
    try {
      // Remove from favorites
      await db.favorites.where({ quoteId }).delete();
      
      // Update state
      setFavorites(prev => prev.filter(quote => quote.id !== quoteId));
    } catch (err) {
      console.error('Error removing from favorites:', err);
    }
  };

  const isFavorite = (quoteId) => {
    return favorites.some(quote => quote.id === quoteId);
  };

  const value = {
    quoteOfDay,
    randomQuote,
    favorites,
    loading,
    error,
    isOnline,
    fetchQuoteOfDay,
    fetchRandomQuote,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
};