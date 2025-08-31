import React from 'react';
import Navigation from '../components/Navigation';
import QuoteCard from '../components/QuoteCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useQuotes } from '../contexts/QuoteContext';

const QuoteView = () => {
  const { quoteOfDay, loading, error, fetchQuoteOfDay } = useQuotes();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Quote of the Day
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Discover daily inspiration and wisdom from great minds
            </p>
          </div>
          
          {error && (
            <div className="mb-8">
              <ErrorMessage message={error} onRetry={fetchQuoteOfDay} />
            </div>
          )}
          
          <div className="max-w-3xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <QuoteCard quote={quoteOfDay} />
            )}
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

export default QuoteView;