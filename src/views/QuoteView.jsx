import React from 'react';
import Navigation from '../components/Navigation';
import QuoteCard from '../components/QuoteCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useQuotes } from '../contexts/QuoteContext';

const QuoteView = () => {
  const { quoteOfDay, loading, error, fetchQuoteOfDay } = useQuotes();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8 text-center">Quote of the Day</h1>
        
        {error && (
          <ErrorMessage message={error} onRetry={fetchQuoteOfDay} />
        )}
        
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <div className="h-32 flex items-center justify-center">
              <LoadingSpinner size="large" />
            </div>
          ) : (
            <QuoteCard quote={quoteOfDay} />
          )}
        </div>
      </div>
      
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© {new Date().getFullYear()} Quotify - Daily Inspiration</p>
      </footer>
    </div>
  );
};

export default QuoteView;