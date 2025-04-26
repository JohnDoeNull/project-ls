import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import backgroundImage from '../assets/images/homepagebg3.jpg';
import RainEffect from '../components/RainEffect';

import exploreVRImage from '../assets/images/modes/vr.jpg';
import comicsImage from '../assets/images/modes/comics.jpg';
import gamesImage from '../assets/images/modes/games.jpg';
import storiesImage from '../assets/images/modes/stories.jpg';
import chatbotImage from '../assets/images/modes/chatbot.jpg';

const DashboardPage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [animateOptions, setAnimateOptions] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Animation sequence on component mount
  useEffect(() => {
    // Start welcome section animation
    setShowContent(true);
    
    // Start learning options animation after welcome section
    const timer = setTimeout(() => {
      setAnimateOptions(true);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Function to open Botpress chat bubble
  const openBotpressChat = (e) => {
    e.preventDefault(); // Prevent default navigation
    
    // Check if window.botpressWebChat is available
    window.botpress.open();

  };

  // Learning options data
  const learningOptions = [
    {
      id: 'explore-vr',
      title: 'Explore VR',
      description: 'Explore virtual landmarks and traditional craft villages',
      image: exploreVRImage,
      link: '/explore-vr'
    },
    {
      id: 'games',
      title: 'Games',
      description: 'Learn about culture through fun and engaging games',
      image: gamesImage,
      link: '/games'
    },
    {
      id: 'stories',
      title: 'Stories',
      description: 'Watch animated videos on cultural traditions and history',
      image: storiesImage,
      link: '/stories'
    },
    {
      id: 'chatbot',
      title: 'Chatbot AI',
      description: 'Ask questions about culture and get instant answers',
      image: chatbotImage,
      link: '/chatbot',
      onClick: openBotpressChat // Add onClick handler for chatbot option
    }
  ];

  return (
    <div className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
      {/* Header Component */}
      <Header />
      <RainEffect />

      {/* Dashboard content */}
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Welcome section with fade-in and slide-down animation */}
        <div 
          className={`bg-white bg-opacity-90 rounded-lg p-6 mb-8 shadow-md transform transition-all duration-700 ease-out ${
            showContent 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 -translate-y-10'
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome, {currentUser?.username || 'Learner'}!
              </h1>
              <p className="text-gray-600 mt-2">
                Continue your journey exploring traditional culture.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-300 transform hover:scale-105"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Main heading with bounce animation */}
        <h2 
          className={`text-4xl font-bold text-center text-brown-800 mb-8 drop-shadow-md transition-all duration-700 ease-out ${
            showContent 
              ? 'opacity-100 animate-pulse' 
              : 'opacity-0'
          }`}
        >
          Learn with Traditional Culture
        </h2>

        {/* Learning options grid with staggered fade-in animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningOptions.map((option, index) => (
            option.id === 'chatbot' ? (
              // Special handling for chatbot option
              <div
                key={option.id}
                onClick={option.onClick}
                className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 transform hover:scale-105 cursor-pointer ${
                  animateOptions 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  transitionDelay: `${index * 150}ms`,
                  animationDelay: `${index * 150}ms`
                }}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={option.image} 
                    alt={option.title} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
                <div className="p-4 bg-yellow-50">
                  <h3 className="text-2xl font-bold text-brown-800 mb-2">{option.title}</h3>
                  <p className="text-gray-700">{option.description}</p>
                </div>
              </div>
            ) : (
              // Regular options that navigate to routes
              <Link 
                key={option.id} 
                to={option.link}
                className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 transform hover:scale-105 ${
                  animateOptions 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  transitionDelay: `${index * 150}ms`,
                  animationDelay: `${index * 150}ms`
                }}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={option.image} 
                    alt={option.title} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
                <div className="p-4 bg-yellow-50">
                  <h3 className="text-2xl font-bold text-brown-800 mb-2">{option.title}</h3>
                  <p className="text-gray-700">{option.description}</p>
                </div>
              </Link>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;