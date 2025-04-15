import React from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/images/homepagebg3.jpg'; // Adjust the path as necessary
import Header from '../components/Header';

const HomePage = () => {
  return (
    <div 
      className="min-h-screen flex flex-col bg-sky-blue relative overflow-hidden" 
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Header />

      {/* Main Content */}
      <main className="flex-grow container mx-auto flex flex-col items-center justify-center px-4 z-10">
        <h1 className="text-7xl font-bold text-center mb-8" style={{ textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000', color: '#f5e1c5' }}>
          Learn with<br />Traditional Culture
        </h1>
        
        <p className="text-2xl text-center mb-12 max-w-2xl">
          Explore culture, history, and mythology through games, stories, videos, and more!
        </p>
        
        <Link to="/signup" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-16 rounded-full text-3xl transition-all border-2 border-black transform hover:scale-105">
          Get Started
        </Link>
      </main>
    </div>
  );
};

export default HomePage;