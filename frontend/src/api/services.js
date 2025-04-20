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
const UserService = {
    getMapLocations: async () => {
        try {
            const response = await API.get('/locations');
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
};

export {UserService};