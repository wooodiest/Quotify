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

  const navItems = [
    { path: '/', label: 'Quote of the Day' },
    { path: '/random', label: 'Random Quotes' },
    { path: '/favorites', label: 'Favorites' }
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-glow">
                <span className="text-white text-xl font-bold">Q</span>
              </div>
              <h1 className="text-2xl font-bold gradient-text">Quotify</h1>
            </Link>
            
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === item.path 
                      ? 'bg-primary-500 text-white shadow-md' 
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
              <div className="flex items-center space-x-2">
                <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
                <span className="text-sm text-gray-700 font-medium">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>

            {user && (
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                  <span className="text-sm text-gray-700 font-medium">
                    Welcome, {user.firstName}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm"
                >
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="md:hidden mt-4">
          <div className="flex space-x-1 overflow-x-auto pb-2">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                  location.pathname === item.path 
                    ? 'bg-primary-500 text-white shadow-md' 
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;