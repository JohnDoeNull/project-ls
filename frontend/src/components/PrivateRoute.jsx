import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If user is authenticated, render the child routes/components
  // Otherwise, redirect to login page with a return URL
  return isAuthenticated() ? (
    <Outlet />
  ) : (
    <Navigate 
      to="/login" 
      state={{ returnUrl: window.location.pathname }} 
      replace 
    />
  );
};

export default PrivateRoute;