import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, currentUser } = useAuth();
  
  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Determine which navigation links to show based on authentication state
  const getNavLinks = () => {
    // Basic links that appear for everyone
    const commonLinks = [
      { path: '/explore-vr', label: 'Explore VR' },
      { path: '/games', label: 'Games' },
      { path: '/comics', label: 'Comics' },
      { path: '/stories', label: 'Stories' },
    ];
    
    // Links shown to logged-in users - note Home is replaced with Dashboard
    const authLinks = [
      { path: '/dashboard', label: 'Dashboard' },
      ...commonLinks,
    ];
    
    // Links shown to logged-out users
    const guestLinks = [
      { path: '/', label: 'Home' },
      ...commonLinks,
      { path: '/login', label: 'Login' },
      { path: '/signup', label: 'Sign Up' },
    ];
    
    return isAuthenticated() ? authLinks : guestLinks;
  };

  // Get appropriate nav links
  const navLinks = getNavLinks();

  return (
    <header className="container mx-auto px-4 py-4 flex justify-between items-center">
      <div className="text-3xl font-bold text-yellow-500" style={{ textShadow: '1px 1px 0 #000' }}>
        <Link to={isAuthenticated() ? '/dashboard' : '/'}>STURDYPATH</Link>
      </div>
      <nav className="flex space-x-4">
        {navLinks.map((link) => (
          <Link 
            key={link.path}
            to={link.path} 
            className={`${isActive(link.path) ? 'text-yellow-600' : 'text-black'} hover:text-yellow-600 font-bold`}
          >
            {link.label}
          </Link>
        ))}
        
        {/* Show profile link or user name if authenticated */}
        {isAuthenticated() && (
          <Link 
            to="/profile" 
            className={`${isActive('/profile') ? 'text-yellow-600' : 'text-black'} hover:text-yellow-600 font-bold`}
          >
            {currentUser?.username || 'Profile'}
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;