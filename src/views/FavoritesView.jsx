import React from 'react';
import Navigation from '../components/Navigation';
import QuoteCard from '../components/QuoteCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useQuotes } from '../contexts/QuoteContext';

const FavoritesView = () => {
  const { favorites, loading } = useQuotes();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-grow px-4 py-8">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Favorite Quotes
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Your collection of inspiring quotes and wisdom
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <LoadingSpinner size="large" />
            </div>
          ) : favorites.length > 0 ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                  <span className="text-white/70 text-sm font-medium">
                    {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {favorites.map((quote) => (
                  <div key={quote.id} className="flex">
                    <QuoteCard quote={quote} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-12 h-12 text-white/50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No favorites yet</h3>
                <p className="text-white/70 text-lg mb-8">
                  Start adding quotes to your favorites to see them here.
                </p>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <p className="text-white/80 text-sm">
                    Click the heart icon on any quote to add it to your favorites.
                  </p>
                </div>
              </div>
            </div>
          )}
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

export default FavoritesView;