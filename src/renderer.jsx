import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { useAuth } from './contexts/AuthContext';

import { AuthProvider } from './contexts/AuthContext';
import { QuoteProvider } from './contexts/QuoteContext';

import LoginView from './views/LoginView';
import QuoteView from './views/QuoteView';
import RandomView from './views/RandomView';
import FavoritesView from './views/FavoritesView';

import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
      <AuthProvider>
        <QuoteProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginView />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <QuoteView />
                </ProtectedRoute>
              } />
              <Route path="/random" element={
                <ProtectedRoute>
                  <RandomView />
                </ProtectedRoute>
              } />
              <Route path="/favorites" element={
                <ProtectedRoute>
                  <FavoritesView />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </QuoteProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
