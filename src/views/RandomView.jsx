import React from 'react';
import Navigation from '../components/Navigation';
import QuoteCard from '../components/QuoteCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useQuotes } from '../contexts/QuoteContext';

const RandomView = () => {
  const { randomQuote, loading, error, fetchRandomQuote } = useQuotes();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Random Quote
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Discover unexpected wisdom and inspiration
            </p>
          </div>
          
          {error && (
            <div className="mb-8">
              <ErrorMessage message={error} onRetry={fetchRandomQuote} />
            </div>
          )}
          
          <div className="max-w-3xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <QuoteCard quote={randomQuote} />
            )}
          </div>
          
          <div className="text-center mt-12">
            <button
              onClick={fetchRandomQuote}
              disabled={loading}
              className={`px-8 py-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                loading 
                  ? 'bg-white/20 text-white/50 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 shadow-lg'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                'Get Another Quote'
              )}
            </button>
          </div>
        </div>
      </div>

      <footer className="backdrop-blur-md bg-white/10 border-t border-white/20 py-6">
        <div className="container mx-auto px-6 text-center">
          <p className="text-white/70">
            © {new Date().getFullYear()} Quotify - Daily Inspiration
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RandomView;