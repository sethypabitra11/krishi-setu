import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('krishi_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('krishi_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validate current token with profile endpoint if token exists
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await api.get('/users/profile');
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('krishi_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid:', err?.response?.data || err.message);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = res.data;

    setToken(receivedToken);
    setUser(receivedUser);

    localStorage.setItem('krishi_token', receivedToken);
    localStorage.setItem('krishi_user', JSON.stringify(receivedUser));

    return receivedUser;
  };

  const signup = async ({ name, email, password, role, aadhaarVerified }) => {
    const res = await api.post('/auth/signup', {
      name,
      email,
      password,
      role,
      aadhaarVerified,
    });

    const { token: receivedToken, user: receivedUser } = res.data;

    setToken(receivedToken);
    setUser(receivedUser);

    localStorage.setItem('krishi_token', receivedToken);
    localStorage.setItem('krishi_user', JSON.stringify(receivedUser));

    return receivedUser;
  };

  const verifyAadhaar = async (aadhaarNumber) => {
    const res = await api.post('/verification/aadhaar', { aadhaarNumber });
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('krishi_token');
    localStorage.removeItem('krishi_user');
  };

  const isFarmer = user?.role === 'farmer';
  const isConsumer = user?.role === 'consumer';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isFarmer,
        isConsumer,
        login,
        signup,
        verifyAadhaar,
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
