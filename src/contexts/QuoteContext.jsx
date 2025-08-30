import React, { createContext, useState, useEffect, useContext } from 'react';
import { QuoteService } from '../services/quote.service';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const QuoteContext = createContext();

export const useQuotes = () => useContext(QuoteContext);

export const QuoteProvider = ({ children }) => {
  const [quoteOfDay, setQuoteOfDay] = useState(null);
  const [randomQuote, setRandomQuote] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isOnline = useOnlineStatus();

  // Ładowanie ulubionych cytatów
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favs = await QuoteService.getFavorites();
        setFavorites(favs);
      } catch (err) {
        console.error('Error loading favorites:', err);
      }
    };

    loadFavorites();
  }, []);

  // Ładowanie cytatu dnia
  useEffect(() => {
    const loadQuoteOfDay = async () => {
      try {
        setLoading(true);
        const quote = await QuoteService.getQuoteOfDay();
        setQuoteOfDay(quote);
      } catch (err) {
        console.error('Error loading quote of the day:', err);
        setError('Failed to load quote of the day');
      } finally {
        setLoading(false);
      }
    };

    loadQuoteOfDay();
  }, [isOnline]);

  // Ładowanie losowego cytatu
  useEffect(() => {
    const loadRandomQuote = async () => {
      try {
        const quote = await QuoteService.getRandomQuote();
        setRandomQuote(quote);
      } catch (err) {
        console.error('Error loading random quote:', err);
      }
    };

    loadRandomQuote();
  }, []);

  const fetchQuoteOfDay = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const quote = await QuoteService.getQuoteOfDay();
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
      const quote = await QuoteService.refreshRandomQuote();
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
      await QuoteService.addToFavorites(quote);
      setFavorites(prev => [...prev, quote]);
    } catch (err) {
      console.error('Error adding to favorites:', err);
      setError('Failed to add quote to favorites');
    }
  };

  const removeFromFavorites = async (quoteId) => {
    try {
      await QuoteService.removeFromFavorites(quoteId);
      setFavorites(prev => prev.filter(quote => quote.id !== quoteId));
    } catch (err) {
      console.error('Error removing from favorites:', err);
      setError('Failed to remove quote from favorites');
    }
  };

  const isFavorite = async (quoteId) => {
    try {
      return await QuoteService.isFavorite(quoteId);
    } catch (err) {
      console.error('Error checking if quote is favorite:', err);
      return favorites.some(quote => quote.id === quoteId);
    }
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