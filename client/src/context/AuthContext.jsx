import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export const RESTRICTION_MESSAGE =
  'Login access is temporarily unavailable. We are working on improvements. Please try again later.';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [isRestricted, setIsRestricted] = useState(false);

  // Check restriction status & load user session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      let currentlyRestricted = false;

      try {
        const statusRes = await api.get('/auth/restriction-status');
        if (statusRes.data && typeof statusRes.data.restricted === 'boolean') {
          currentlyRestricted = statusRes.data.restricted;
        }
      } catch (e) {
        currentlyRestricted = false;
      }

      setIsRestricted(currentlyRestricted);

      // If restricted, invalidate any stale cached tokens to prevent dashboard entry
      if (currentlyRestricted) {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      // If not restricted, restore authenticated session if token exists
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
          setProfile(res.data.profile);
        }
      } catch (err) {
        console.error('Session restoration failed:', err);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token]);

  const login = async (email, password) => {
    // If client already knows dashboards are restricted, reject immediately
    if (isRestricted) {
      const err = new Error(RESTRICTION_MESSAGE);
      err.response = { data: { message: RESTRICTION_MESSAGE } };
      throw err;
    }

    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);

      // Fetch profile
      try {
        const meRes = await api.get('/auth/me');
        if (meRes.data.success) {
          setProfile(meRes.data.profile);
        }
      } catch (e) {
        // Ignored
      }
      return res.data;
    } else {
      const err = new Error(res.data.message || RESTRICTION_MESSAGE);
      err.response = { data: { message: res.data.message || RESTRICTION_MESSAGE } };
      throw err;
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      // If restricted, do not persist token to prevent unauthorized dashboard navigation
      if (!isRestricted && res.data.token) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
      }
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (isRestricted) return;
    try {
      const meRes = await api.get('/auth/me');
      if (meRes.data.success) {
        setUser(meRes.data.user);
        setProfile(meRes.data.profile);
      }
    } catch (e) {
      console.error('Failed to refresh profile:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        isAuthenticated: !!user && !isRestricted,
        isRestricted,
        restrictionMessage: RESTRICTION_MESSAGE,
        login,
        register,
        logout,
        refreshProfile,
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
