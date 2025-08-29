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
  
  // Load saved random quote
  useEffect(() => {
    const loadRandomQuote = async () => {
      try {
        // Check if we already have a random quote stored
        let storedRandomQuote = null;
        
        // Try to get from electronAPI if available
        if (window.electronAPI && window.electronAPI.store) {
          storedRandomQuote = await window.electronAPI.store.get('randomQuote');
        } else {
          // Fallback to localStorage
          const storedData = localStorage.getItem('randomQuote');
          if (storedData) {
            try {
              storedRandomQuote = JSON.parse(storedData);
            } catch (parseErr) {
              console.error('Error parsing random quote from localStorage:', parseErr);
            }
          }
        }
        
        if (storedRandomQuote) {
          setRandomQuote(storedRandomQuote);
        } else {
          // If no stored random quote, fetch a new one
          await fetchRandomQuote();
        }
      } catch (err) {
        console.error('Error loading random quote:', err);
      }
    };

    loadRandomQuote();
  }, []);

  // Load quote of the day and random quote
  useEffect(() => {
    const loadQuoteOfDay = async () => {
      try {
        // Check if we already have a quote of the day stored and it's from today
        let storedQuoteOfDay = null;
        
        // Try to get from electronAPI if available
        if (window.electronAPI && window.electronAPI.store) {
          storedQuoteOfDay = await window.electronAPI.store.get('quoteOfDay');
        } else {
          // Fallback to localStorage
          const storedData = localStorage.getItem('quoteOfDay');
          if (storedData) {
            try {
              storedQuoteOfDay = JSON.parse(storedData);
            } catch (parseErr) {
              console.error('Error parsing quote of day from localStorage:', parseErr);
            }
          }
        }
        
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
      const quoteData = {
        quote,
        date: new Date().toDateString()
      };
      
      // Try to store in electronAPI if available
      if (window.electronAPI && window.electronAPI.store) {
        await window.electronAPI.store.set('quoteOfDay', quoteData);
      } else {
        // Fallback to localStorage
        localStorage.setItem('quoteOfDay', JSON.stringify(quoteData));
      }
      
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

  // Dodajemy zmienną, która zapobiega wielokrotnemu wywoływaniu fetchRandomQuote
  let isFetchingRandomQuote = false;
  
  const fetchRandomQuote = async () => {
    console.log('QuoteContext - fetchRandomQuote called');
    
    // Jeśli już pobieramy cytat, nie rób tego ponownie
    if (isFetchingRandomQuote) {
      console.log('Already fetching random quote, skipping duplicate call');
      return;
    }
    
    isFetchingRandomQuote = true;
    setLoading(true);
    setError(null);
    
    try {
      if (isOnline) {
        const response = await axios.get('https://dummyjson.com/quotes/random');
        const quote = response.data;
        
        // Store in IndexedDB
        await db.quotes.put(quote);
        
        // Store in electronAPI or localStorage
        if (window.electronAPI && window.electronAPI.store) {
          await window.electronAPI.store.set('randomQuote', quote);
        } else {
          // Fallback to localStorage
          localStorage.setItem('randomQuote', JSON.stringify(quote));
        }
        
        setRandomQuote(quote);
        isFetchingRandomQuote = false; // Reset flag
        return quote;
      } else {
        // If offline, use a random quote from the cache
        const cachedQuotes = await db.quotes.toArray();
        if (cachedQuotes.length > 0) {
          const randomIndex = Math.floor(Math.random() * cachedQuotes.length);
          const quote = cachedQuotes[randomIndex];
          
          // Store in electronAPI or localStorage
          if (window.electronAPI && window.electronAPI.store) {
            await window.electronAPI.store.set('randomQuote', quote);
          } else {
            // Fallback to localStorage
            localStorage.setItem('randomQuote', JSON.stringify(quote));
          }
          
          setRandomQuote(quote);
          isFetchingRandomQuote = false; // Reset flag
          return quote;
        } else {
          isFetchingRandomQuote = false; // Reset flag even on error
          throw new Error('No cached quotes available');
        }
      }
    } catch (err) {
      setError('Failed to fetch random quote');
      console.error('Error fetching random quote:', err);
      isFetchingRandomQuote = false; // Reset flag on error
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