import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, currentUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Toggle menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close menu (for when a link is clicked)
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Determine which navigation links to show based on authentication state
  const getNavLinks = () => {
    // Basic links that appear for everyone
    const commonLinks = [
      { path: '/explore-vr', label: 'Explore VR' },
      { path: '/games', label: 'Games' },
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
    
    // Add profile link for authenticated users
    if (isAuthenticated()) {
      authLinks.push({ 
        path: '/profile', 
        label: currentUser?.username || 'Profile' 
      });
    }
    
    return isAuthenticated() ? authLinks : guestLinks;
  };

  // Get appropriate nav links
  const navLinks = getNavLinks();

  return (
    <header className="container mx-auto px-4 py-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl md:text-3xl font-bold text-yellow-500" style={{ textShadow: '1px 1px 0 #000' }}>
          <Link to={isAuthenticated() ? '/dashboard' : '/'} onClick={closeMenu}>STURDYPATH</Link>
        </div>

        {/* Desktop Navigation - Hidden on mobile */}
        <nav className="hidden md:flex space-x-4">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={`${isActive(link.path) ? 'text-yellow-600' : 'text-black'} hover:text-yellow-600 font-bold`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button - Visible only on mobile */}
        <button 
          className="md:hidden text-black focus:outline-none"
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? (
            // X icon when menu is open
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger icon when menu is closed
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu - Slides down when menu is open */}
      {menuOpen && (
        <nav className="md:hidden mt-4 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`py-3 px-4 border-b border-gray-100 ${isActive(link.path) ? 'text-yellow-600 bg-yellow-50' : 'text-black'} hover:text-yellow-600 hover:bg-yellow-50 font-medium`}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;