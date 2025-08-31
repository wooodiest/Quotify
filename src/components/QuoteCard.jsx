import React, { useState, useEffect } from 'react';
import { useQuotes } from '../contexts/QuoteContext';

const QuoteCard = ({ quote, showActions = true }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useQuotes();
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if (quote) {
      const checkFavorite = async () => {
        const result = await isFavorite(quote.id);
        setIsFav(result);
      };
      checkFavorite();
    }
  }, [quote, isFavorite]);

  if (!quote) {
    return (
      <div className="card p-8 animate-pulse flex-1">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  const handleFavoriteToggle = async () => {
    if (isFav) {
      await removeFromFavorites(quote.id);
      setIsFav(false);
    } else {
      await addToFavorites(quote);
      setIsFav(true);
    }
  };

  return (
    <div className="card p-8 flex flex-col flex-1">
      <blockquote className="text-center mb-8 flex-1 flex flex-col justify-center">
        <p className="font-serif text-2xl md:text-3xl text-gray-800 leading-relaxed mb-6">
          "{quote.quote}"
        </p>
        
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-0.5 bg-gradient-to-r from-primary-400 to-secondary-400"></div>
          <p className="font-semibold text-lg text-gray-700">
            — {quote.author}
          </p>
          <div className="w-8 h-0.5 bg-gradient-to-r from-secondary-400 to-primary-400"></div>
        </div>
      </blockquote>
      
      {showActions && (
        <div className="flex justify-center mt-auto">
          <button
            onClick={handleFavoriteToggle}
            className={`group flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
              isFav 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg' 
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-600'
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-6 w-6 transition-all duration-300 ${
                isFav ? 'text-white' : 'text-gray-400 group-hover:text-primary-500'
              }`}
              viewBox="0 0 20 20" 
              fill={isFav ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={isFav ? '0' : '2'}
            >
              <path 
                fillRule="evenodd" 
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
                clipRule="evenodd" 
              />
            </svg>
            <span className="font-medium">
              {isFav ? 'Remove from Favorites' : 'Add to Favorites'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default QuoteCard;