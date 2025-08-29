import React from 'react';
import Navigation from '../components/Navigation';
import QuoteCard from '../components/QuoteCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useQuotes } from '../contexts/QuoteContext';

const FavoritesView = () => {
  const { favorites, loading } = useQuotes();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8 text-center">Favorite Quotes</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <LoadingSpinner size="large" />
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No favorites yet</h3>
            <p className="mt-1 text-gray-500">
              Start adding quotes to your favorites to see them here.
            </p>
          </div>
        )}
      </div>
      
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© {new Date().getFullYear()} Quotify - Daily Inspiration</p>
      </footer>
    </div>
  );
};

export default FavoritesView;
