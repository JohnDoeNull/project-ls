import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import backgroundImage from '../assets/images/homepagebg3.jpg';

import exploreVRImage from '../assets/images/modes/vr.jpg';
import comicsImage from '../assets/images/modes/comics.jpg';
import gamesImage from '../assets/images/modes/games.jpg';
import storiesImage from '../assets/images/modes/stories.jpg';
import chatbotImage from '../assets/images/modes/chatbot.jpg';

const DashboardPage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // These would be replaced with your actual image imports
  const placeholderImage = "https://via.placeholder.com/240x180";

  // Learning options data
  const learningOptions = [
    {
      id: 'explore-vr',
      title: 'Explore VR',
      description: 'Explore virtual landmarks and traditional craft villages',
      image: exploreVRImage, // exploreVRImage
      link: '/explore-vr'
    },
    {
      id: 'games',
      title: 'Games',
      description: 'Learn about culture through fun and engaging games',
      image: gamesImage, // gamesImage
      link: '/games'
    },
    {
      id: 'stories',
      title: 'Stories',
      description: 'Watch animated videos on cultural traditions and history',
      image: storiesImage, // storiesImage
      link: '/stories'
    },
    {
      id: 'chatbot',
      title: 'Chatbot AI',
      description: 'Ask questions about culture and get instant answers',
      image: chatbotImage, // chatbotImage
      link: '/chatbot'
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

      {/* Dashboard content */}
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Welcome section */}
        <div className="bg-white bg-opacity-90 rounded-lg p-6 mb-8 shadow-md">
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
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Main heading */}
        <h2 className="text-4xl font-bold text-center text-brown-800 mb-8 drop-shadow-md">
          Learn with Traditional Culture
        </h2>

        {/* Learning options grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningOptions.map((option) => (
            <Link 
              key={option.id} 
              to={option.link}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={option.image} 
                  alt={option.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 bg-yellow-50">
                <h3 className="text-2xl font-bold text-brown-800 mb-2">{option.title}</h3>
                <p className="text-gray-700">{option.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;