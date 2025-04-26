import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import backgroundImage from '../assets/images/homepagebg3.jpg';
import loginHeaderImg from '../assets/images/homepagebg3.jpg';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});

  // Check for messages passed from other pages (like successful registration)
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the location state after showing message
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      // Redirect to dashboard instead of the homepage after login
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
    
    // Clear API error when user makes any change
    if (apiError) {
      setApiError(null);
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      setLoading(true);
      setApiError(null);
      
      try {
        // Call the login function from AuthContext
        await login({
          email: formData.email,
          password: formData.password
        });
        
        // If we get here, login was successful
        // Redirect will happen via the useEffect that watches currentUser
        // Now redirects to /dashboard instead of homepage
      } catch (error) {
        setLoading(false);
        
        // Handle API errors
        if (typeof error === 'string') {
          setApiError(error);
        } else if (error.message) {
          setApiError(error.message);
        } else {
          setApiError('Login failed. Please check your credentials and try again.');
        }
      }
    }
  };

  // Handle social login
  const handleSocialLogin = (provider) => {
    // This would be implemented based on your backend social auth setup
    console.log(`Social login with ${provider}`);
    // You could redirect to your backend OAuth endpoints here
    // window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
      {/* Header Component */}
      <Header />

      <div className="flex-grow flex flex-col items-center justify-center">
        {/* Background image top section */}
        <div className="w-full max-w-md rounded-t-3xl overflow-hidden mb-2" style={{ height: '180px' }}>
          <img 
            src={loginHeaderImg} 
            alt="Japanese temple landscape" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 max-w-md mx-4 text-sm">
            {successMessage}
          </div>
        )}
        
        {/* API Error message */}
        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 max-w-md mx-4 text-sm">
            {apiError}
          </div>
        )}
        
        {/* Form container */}
        <div className="w-full max-w-md bg-white rounded-lg p-6 mb-2 shadow-md mx-4">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Log In</h1>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                className={`w-full px-4 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            
            <div>
              <input
                className={`w-full px-4 py-2 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                disabled={loading}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600"
                  disabled={loading}
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            
            <button
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          
          <div className="my-4 flex items-center justify-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm">Don't have an account?</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <div className="mt-6 text-center">
            <Link 
              to="/Signup" 
              className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;