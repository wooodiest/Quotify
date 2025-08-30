import React, { createContext, useState, useEffect, useContext } from 'react';
import { QuoteService } from '../services/quote.service';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useAuth } from './AuthContext';

const QuoteContext = createContext();

export const useQuotes = () => useContext(QuoteContext);

export const QuoteProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id;

  const [quoteOfDay, setQuoteOfDay] = useState(null);
  const [randomQuote, setRandomQuote] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        if (!userId) return;
        const favs = await QuoteService.getFavorites(userId);
        setFavorites(favs);
      } catch (err) {
        console.error('Error loading favorites:', err);
      }
    };

    loadFavorites();
  }, [userId]);

  useEffect(() => {
    const preloadQuotes = async () => {
      try {
        if (!userId) return;
        const shouldRefresh = await QuoteService.shouldRefreshQuotesCache(userId);
        if (shouldRefresh) {
          await QuoteService.getAndCacheMultipleQuotes(userId, 50); 
        }
      } catch (err) {
        console.error("Error preloading quotes:", err);
      }
    };

    preloadQuotes();
  }, [userId]);

  useEffect(() => {
    const loadQuoteOfDay = async () => {
      try {
        if (!userId) return;
        setLoading(true);
        const quote = await QuoteService.getQuoteOfDay(userId);
        setQuoteOfDay(quote);
      } catch (err) {
        console.error('Error loading quote of the day:', err);
        setError('Failed to load quote of the day');
      } finally {
        setLoading(false);
      }
    };

    loadQuoteOfDay();
  }, [isOnline, userId]);

  useEffect(() => {
    const loadRandomQuote = async () => {
      try {
        if (!userId) return;
        const quote = await QuoteService.getRandomQuote(userId);
        setRandomQuote(quote);
      } catch (err) {
        console.error('Error loading random quote:', err);
      }
    };

    loadRandomQuote();
  }, [userId]);

  const fetchQuoteOfDay = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!userId) return;
      const quote = await QuoteService.getQuoteOfDay(userId);
      setQuoteOfDay(quote);
      return quote;
    } catch (err) {
      setError('Failed to fetch quote of the day');
      console.error('Error fetching quote of the day:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomQuote = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!userId) return;
      const quote = await QuoteService.refreshRandomQuote(userId);
      setRandomQuote(quote);
      return quote;
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
      if (!userId) return;
      await QuoteService.addToFavorites(userId, quote);
      setFavorites(prev => [...prev, quote]);
    } catch (err) {
      console.error('Error adding to favorites:', err);
      setError('Failed to add quote to favorites');
    }
  };

  const removeFromFavorites = async (quoteId) => {
    try {
      if (!userId) return;
      await QuoteService.removeFromFavorites(userId, quoteId);
      setFavorites(prev => prev.filter(quote => quote.id !== quoteId));
    } catch (err) {
      console.error('Error removing from favorites:', err);
      setError('Failed to remove quote from favorites');
    }
  };

  const isFavorite = (quoteId) => favorites.some(quote => quote.id === quoteId);

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