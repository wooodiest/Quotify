import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuotes } from '../contexts/QuoteContext';

const Navigation = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { isOnline } = useQuotes();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Quotify</h1>
          <div className="flex space-x-2">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md ${location.pathname === '/' ? 'bg-gray-900' : 'hover:bg-gray-700'}`}
            >
              Quote of the Day
            </Link>
            <Link 
              to="/random" 
              className={`px-3 py-2 rounded-md ${location.pathname === '/random' ? 'bg-gray-900' : 'hover:bg-gray-700'}`}
            >
              Random Quotes
            </Link>
            <Link 
              to="/favorites" 
              className={`px-3 py-2 rounded-md ${location.pathname === '/favorites' ? 'bg-gray-900' : 'hover:bg-gray-700'}`}
            >
              Favorites
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className={`h-2 w-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          {user && (
            <div className="flex items-center space-x-2">
              <span className="text-sm">{user.firstName}</span>
              <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;