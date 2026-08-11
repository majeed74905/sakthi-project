import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import { setAccessToken, clearAccessToken } from '../services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore authenticated session on mount via HttpOnly Refresh Cookie
  useEffect(() => {
    async function restoreSession() {
      try {
        // Attempt token refresh via Secure HttpOnly Cookie
        const refreshRes = await authService.refreshToken();
        if (refreshRes.success && refreshRes.data?.accessToken) {
          setAccessToken(refreshRes.data.accessToken);
          const response = await authService.getCurrentUser();
          if (response.success && response.data.user) {
            setUser(response.data.user);
          }
        }
      } catch (err) {
        clearAccessToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  const login = async (identifier, password) => {
    const response = await authService.loginUser({ identifier, password });
    if (response.success && response.data) {
      const { user: userData, accessToken } = response.data;
      setAccessToken(accessToken); // Memory-only storage
      setUser(userData);
      return response;
    }
    throw new Error(response.message || 'Login failed');
  };

  const logout = async () => {
    try {
      await authService.logoutUser();
    } catch (err) {
      // Ignore logout network errors
    } finally {
      clearAccessToken();
      setUser(null);
    }
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : null));
  };

  const value = {
    user,
    isAuthenticated: !!user,
    role: user ? user.role : null,
    loading,
    login,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
