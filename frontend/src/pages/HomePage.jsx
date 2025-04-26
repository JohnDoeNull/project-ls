import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/images/homepagebg3.jpg';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import RainEffect from '../components/RainEffect';

const HomePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  // Simpler animation trigger
  useEffect(() => {
    // Set a small timeout to ensure DOM is ready
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden" 
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Header />
      <RainEffect />

      {/* Main Content */}
      <main className="flex-grow container mx-auto flex flex-col items-center justify-center px-4 z-10">
        <h1 
          className={`text-4xl md:text-7xl font-bold text-center mb-8 transition-transform duration-700 ease-out ${
            loaded ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
          }`} 
          style={{ 
            textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
            color: '#f5e1c5',
            transitionProperty: 'transform, opacity',
            transitionDelay: '0.1s'
          }}
        >
          Learn with<br />Traditional Culture
        </h1>
        
        <p 
          className={`text-xl md:text-2xl text-center mb-12 max-w-2xl transition-all duration-700 ease-out ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
          style={{ 
            textShadow: '1px 1px 3px rgba(0,0,0,0.8)', 
            color: 'white',
            transitionDelay: '0.3s'
          }}
        >
          Explore culture, history, and mythology through games, stories, videos, and more!
        </p>
        
        <Link 
          to="/signup" 
          className={`bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-16 rounded-full text-xl md:text-3xl transition-all duration-500 border-2 border-black hover:scale-105 ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
          style={{ 
            transitionDelay: '0.5s',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          Get Started
        </Link>
      </main>
    </div>
  );
};

export default HomePage;