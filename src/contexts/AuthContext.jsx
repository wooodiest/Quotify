import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        // Check if electronAPI is available
        if (window.electronAPI && window.electronAPI.store) {
          const authData = await window.electronAPI.store.get('auth');
          if (authData) {
            setUser(authData);
          }
        } else {
          console.warn('electronAPI or store not available, checking localStorage');
          // Fallback to localStorage if electronAPI is not available
          const storedAuth = localStorage.getItem('auth');
          if (storedAuth) {
            try {
              const authData = JSON.parse(storedAuth);
              setUser(authData);
            } catch (parseErr) {
              console.error('Error parsing auth data from localStorage:', parseErr);
            }
          }
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('https://dummyjson.com/auth/login', {
        username,
        password,
      });

      const userData = response.data;
      
      // Save auth data to electron-store if available
      if (window.electronAPI && window.electronAPI.store) {
        await window.electronAPI.store.set('auth', userData);
      } else {
        console.warn('electronAPI or store not available for saving auth data');
        // Fallback to localStorage if electronAPI is not available
        localStorage.setItem('auth', JSON.stringify(userData));
      }
      
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear auth data from electron-store if available
      if (window.electronAPI && window.electronAPI.store) {
        await window.electronAPI.store.set('auth', null);
      } else {
        console.warn('electronAPI or store not available for clearing auth data');
        // Fallback to localStorage if electronAPI is not available
        localStorage.removeItem('auth');
      }
      setUser(null);
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};