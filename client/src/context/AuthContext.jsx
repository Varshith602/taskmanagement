import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('taskflow_token') || null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in upon initial app mount
  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('taskflow_token');
      const storedUser = localStorage.getItem('taskflow_user');

      if (storedToken) {
        try {
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          // Fetch fresh user profile from backend
          const res = await authService.getMe();
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('taskflow_user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.warn('Session expired or invalid token', error);
          logout();
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.data.success) {
      const { token, user } = res.data;
      localStorage.setItem('taskflow_token', token);
      localStorage.setItem('taskflow_user', JSON.stringify(user));
      setToken(token);
      setUser(user);
      return { success: true };
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    const res = await authService.register({ name, email, password });
    if (res.data.success) {
      const { token, user } = res.data;
      localStorage.setItem('taskflow_token', token);
      localStorage.setItem('taskflow_user', JSON.stringify(user));
      setToken(token);
      setUser(user);
      return { success: true };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
