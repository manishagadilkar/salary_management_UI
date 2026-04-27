import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Configure axios to include auth token
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE}/api/v1/login`, { email, password });
      const { token: authToken, user: userData } = response.data;
      
      setToken(authToken);
      setUser(userData);
      localStorage.setItem('token', authToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
