import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="container mx-auto px-4 py-4 flex justify-between items-center">
      <div className="text-3xl font-bold text-yellow-500" style={{ textShadow: '1px 1px 0 #000' }}>
        STURDYPATH
      </div>
      <nav className="flex space-x-4">
        <Link 
          to="/" 
          className={`${isActive('/') ? 'text-yellow-600' : 'text-black'} hover:text-yellow-600 font-bold`}
        >
          Home
        </Link>
        <Link 
          to="/features" 
          className={`${isActive('/features') ? 'text-yellow-600' : 'text-black'} hover:text-yellow-600 font-bold`}
        >
          Features
        </Link>
        <Link 
          to="/about" 
          className={`${isActive('/about') ? 'text-yellow-600' : 'text-black'} hover:text-yellow-600 font-bold`}
        >
          About
        </Link>
        <Link 
          to="/contact" 
          className={`${isActive('/contact') ? 'text-yellow-600' : 'text-black'} hover:text-yellow-600 font-bold`}
        >
          Contact
        </Link>
      </nav>
    </header>
  );
};

export default Header;