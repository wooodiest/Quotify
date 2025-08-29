import React, { useEffect } from 'react';
import Navigation from '../components/Navigation';
import QuoteCard from '../components/QuoteCard';
import { useQuotes } from '../contexts/QuoteContext';

const RandomView = () => {
  const { randomQuote, loading, error, fetchRandomQuote } = useQuotes();

  // Usuwamy useEffect, który wywoływał fetchRandomQuote, ponieważ teraz QuoteContext zajmuje się ładowaniem zapisanego cytatu
  
  // Add a debug log to track component renders
  console.log('RandomView rendering, randomQuote:', randomQuote ? randomQuote.id : 'none');

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8 text-center">Random Quote</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
            </div>
          ) : (
            <QuoteCard quote={randomQuote} />
          )}
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={fetchRandomQuote}
            disabled={loading}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Loading...' : 'Get Another Quote'}
          </button>
        </div>
      </div>
      
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© {new Date().getFullYear()} Quotify - Daily Inspiration</p>
      </footer>
    </div>
  );
};

export default RandomView;