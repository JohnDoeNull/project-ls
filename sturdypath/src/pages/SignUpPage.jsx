import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import signupHeaderImg from '../assets/images/signupHeader.png'; // Adjust the path as necessary
import backgroundImage from '../assets/images/homepagebg.jpg'; // Adjust the path as necessary

const SignUpPage = () => {
    const [formData, setFormData] = useState({
      fullName: '',
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
    };
  
    const validate = () => {
      const newErrors = {};
      
      // Full name validation
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      
      // Email validation
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
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
  
    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (validate()) {
        // Submit form data to your backend
        console.log('Form submitted:', formData);
        // Redirect or show success message
        alert('Sign up successful! Redirecting to login...');
        // You would typically redirect to login or dashboard here
      }
    };
  
    return (
      <div className="h-screen flex flex-col bg-sky-blue overflow-hidden"
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
              src={signupHeaderImg} 
              alt="Japanese temple landscape" 
              className="w-full h-full object-cover"
            />
          </div>
  
          {/* Sign Up header */}
          
          {/* Form container */}
          <div className="w-full max-w-md bg-white rounded-lg p-6 mb-2 shadow-md mx-4">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Sign Up</h1>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full name"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>
              
              <div>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              
              <div>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
              
              <div>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>
              
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                type="submit"
              >
                Sign Up
              </button>
            </form>
            
            <div className="my-4 flex items-center justify-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 text-sm">Or continue with</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center py-1.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6173 0 3.0684.55566 4.1738 1.61621 1.2207 1.14258 1.8652 2.71387 1.8652 4.66895 0 3.45117-2.4844 5.9414-6.0391 5.9414-3.5156 0-6.03906-2.4375-6.03906-5.9414 0-3.45117 2.52346-5.9414 6.03906-5.9414zm0-2.25c-4.97266 0-9 3.33984-9 8.19141 0 4.8516 4.02734 8.1914 9 8.1914 4.9727 0 9-3.3398 9-8.1914 0-4.85157-4.0273-8.19141-9-8.19141z" />
                  <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H.65v3.09C2.65 21.3 6.93 24 12 24z" />
                  <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H.65C.24 8.18 0 9.95 0 12s.24 3.82.65 5.38l4.62-3.09z" />
                  <path fill="#EA4335" d="M12 5.38c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.89 15.24 0 12 0 6.93 0 2.65 2.7.65 6.62l4.62 3.09C6.22 7.49 8.87 5.38 12 5.38z" />
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center py-1.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>
          </div>
          
          <div className="text-center mt-1">
            <p className="text-gray-600 text-sm">
              Already have an account? <Link to="/login" className="text-blue-600 font-medium hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default SignUpPage;