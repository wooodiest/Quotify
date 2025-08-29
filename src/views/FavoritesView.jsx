import React from 'react';
import Navigation from '../components/Navigation';
import QuoteCard from '../components/QuoteCard';
import { useQuotes } from '../contexts/QuoteContext';

const FavoritesView = () => {
  const { favorites, loading } = useQuotes();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8 text-center">Favorite Quotes</h1>
        
        {loading ? (
          <div className="animate-pulse space-y-4 max-w-2xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="space-y-6 max-w-2xl mx-auto">
            {favorites.map(quote => (
              <QuoteCard key={quote.id} quote={quote} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 mx-auto text-gray-400 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
            <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-gray-600">
              Add quotes to your favorites by clicking the heart icon on any quote.
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