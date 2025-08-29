import React from 'react';
import { useQuotes } from '../contexts/QuoteContext';

const QuoteCard = ({ quote, showActions = true }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useQuotes();

  if (!quote) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  const handleFavoriteToggle = () => {
    if (isFavorite(quote.id)) {
      removeFromFavorites(quote.id);
    } else {
      addToFavorites(quote);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <blockquote className="italic text-xl mb-4">"{quote.quote}"</blockquote>
      <p className="text-right font-semibold">— {quote.author}</p>
      
      {showActions && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleFavoriteToggle}
            className={`flex items-center px-4 py-2 rounded-md ${isFavorite(quote.id) 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-1" 
              viewBox="0 0 20 20" 
              fill={isFavorite(quote.id) ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={isFavorite(quote.id) ? '0' : '1.5'}
            >
              <path 
                fillRule="evenodd" 
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
                clipRule="evenodd" 
              />
            </svg>
            {isFavorite(quote.id) ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuoteCard;