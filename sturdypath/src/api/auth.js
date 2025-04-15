import axios from 'axios';

// Create an axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Important setting for cookie-based auth
  withCredentials: true // This allows cookies to be sent and received
});

// Authentication related API calls
const AuthService = {
  // Register a new user
  register: async (userData) => {
    try {
      // Make sure the userData object matches the backend expected format
      const registerData = {
        username: userData.username,
        email: userData.email,
        password: userData.password
      };
      
      const response = await API.post('/auth/register', registerData);
      return response.data;
    } catch (error) {
      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with an error status
        throw error.response.data;
      } else if (error.request) {
        // The request was made but no response was received
        throw { message: 'No response from server. Please try again later.' };
      } else {
        // Something happened in setting up the request
        throw { message: error.message };
      }
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await API.post('/auth/login', credentials);
      // No need to store token in localStorage since the cookie handles it
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else if (error.request) {
        throw { message: 'No response from server. Please try again later.' };
      } else {
        throw { message: error.message };
      }
    }
  },

  // Logout user
  logout: async () => {
    try {
      await API.post('/auth/logout');
      // The backend should clear the cookie
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await API.get('/auth/me');
      return response.data;
    } catch (error) {
      return null; // Not authenticated or error
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const response = await API.get('/auth/check');
      return response.data.authenticated || false;
    } catch (error) {
      return false;
    }
  }
};

export default AuthService;