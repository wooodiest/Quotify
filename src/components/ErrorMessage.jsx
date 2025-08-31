import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-100 px-6 py-4 rounded-xl mb-6">
      <div className="flex items-start space-x-3">
        <svg
          className="w-6 h-6 text-red-300 flex-shrink-0 mt-0.5"
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
        <div className="flex-1">
          <p className="font-medium">{message}</p>
          
          {onRetry && (
            <div className="mt-3">
              <button
                onClick={onRetry}
                className="inline-flex items-center space-x-2 bg-red-500/30 hover:bg-red-500/40 text-red-100 py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm font-medium">Try Again</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;