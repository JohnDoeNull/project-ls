import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../api/auth';

// Create the authentication context
const AuthContext = createContext(null); // Initialize with null

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Check authentication status on mount and when dependencies change
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        // Get the current user data
        const userData = await AuthService.getCurrentUser();
        setCurrentUser(userData);
        setAuthenticated(!!userData);
      } catch (error) {
        setCurrentUser(null);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Register a new user
  const register = async (userData) => {
    try {
      return await AuthService.register(userData);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      const response = await AuthService.login(credentials);
      // After login, fetch the user data
      const userData = await AuthService.getCurrentUser();
      setCurrentUser(userData);
      setAuthenticated(true);
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await AuthService.logout();
      setCurrentUser(null);
      setAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return authenticated;
  };

  // Context value
  const value = {
    currentUser,
    loading,
    authenticated,
    register,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;