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
            <span className="mx-4 text-gray-500 text-sm">Or continue with</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              className="flex items-center justify-center py-1.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6173 0 3.0684.55566 4.1738 1.61621 1.2207 1.14258 1.8652 2.71387 1.8652 4.66895 0 3.45117-2.4844 5.9414-6.0391 5.9414-3.5156 0-6.03906-2.4375-6.03906-5.9414 0-3.45117 2.52346-5.9414 6.03906-5.9414zm0-2.25c-4.97266 0-9 3.33984-9 8.19141 0 4.8516 4.02734 8.1914 9 8.1914 4.9727 0 9-3.3398 9-8.1914 0-4.85157-4.0273-8.19141-9-8.19141z" />
                <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H.65v3.09C2.65 21.3 6.93 24 12 24z" />
                <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H.65C.24 8.18 0 9.95 0 12s.24 3.82.65 5.38l4.62-3.09z" />
                <path fill="#EA4335" d="M12 5.38c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.89 15.24 0 12 0 6.93 0 2.65 2.7.65 6.62l4.62 3.09C6.22 7.49 8.87 5.38 12 5.38z" />
              </svg>
              Google
            </button>
            <button 
              className="flex items-center justify-center py-1.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              onClick={() => handleSocialLogin('facebook')}
              disabled={loading}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>
        </div>
        
        <div className="text-center mt-1">
          <p className="text-gray-600 text-sm">
            Don't have an account? <Link to="/signup" className="text-blue-600 font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;