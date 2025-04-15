import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import signupHeaderImg from '../assets/images/homepagebg3.jpg';
import backgroundImage from '../assets/images/homepagebg3.jpg';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear field-specific error when the user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
    
    // Clear API error when the user makes any change
    if (apiError) {
      setApiError(null);
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3 || formData.username.length > 30) {
      newErrors.username = 'Username must be between 3 and 30 characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please include a valid email';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
        // Prepare data for API
        const userData = {
          username: formData.username,
          email: formData.email,
          password: formData.password
        };
        
        // Call the register function from AuthContext
        await register(userData);
        
        // Show success message and redirect
        setLoading(false);
        navigate('/login', { 
          state: { message: 'Registration successful! Please log in with your credentials.' } 
        });
      } catch (error) {
        setLoading(false);
        
        // Handle API errors
        if (typeof error === 'string') {
          setApiError(error);
        } else if (error.message) {
          setApiError(error.message);
        } else {
          setApiError('Registration failed. Please try again.');
        }
      }
    }
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
        {/* <div className="w-full max-w-md rounded-t-3xl overflow-hidden mb-2" style={{ height: '180px' }}>
          <img 
            src={signupHeaderImg} 
            alt="Japanese temple landscape" 
            className="w-full h-full object-cover"
          />
        </div> */}

        {/* API Error message */}
        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 max-w-md mx-4 text-sm">
            {apiError}
          </div>
        )}
        
        {/* Form container */}
        <div className="w-full max-w-md bg-white rounded-lg p-6 mb-2 shadow-md mx-4">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Sign Up</h1>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                className={`w-full px-4 py-2 border ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                disabled={loading}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>
            
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
            
            <div>
              <input
                className={`w-full px-4 py-2 border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                disabled={loading}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>
            
            <button
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          
          {/* Already have an account section */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-2">Already have an account?</p>
            <Link 
              to="/login" 
              className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;