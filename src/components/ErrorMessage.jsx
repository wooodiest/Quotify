import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <div className="flex items-center">
        <svg
          className="w-5 h-5 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <span>{message}</span>
      </div>
      
      {onRetry && (
        <div className="mt-2 text-right">
          <button
            onClick={onRetry}
            className="text-sm bg-red-200 hover:bg-red-300 text-red-800 py-1 px-2 rounded focus:outline-none focus:shadow-outline"
          >
            Spróbuj ponownie
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;