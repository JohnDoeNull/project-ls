import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import VietnamMap from '../components/VietMap';
import VRExperience from '../components/VrExperience';
import { UserService } from '../api/services';
import axios from 'axios';
import backgroundImage from '../assets/images/homepagebg3.jpg';
import vrGif from '../assets/images/vr.gif';

const VRPage = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showVR, setShowVR] = useState(false);
  const [locationDetails, setLocationDetails] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const response = await UserService.getMapLocations();
        const transformedLocations = response.data.filter(location => location.vrContent.matterportId).map(location => ({
          id: new Date().getTime() + Math.random(),
          name: location.name,
          description: location.shortDescription,
          x: (location.coordinates.x / 1) * 1,
          y: (location.coordinates.y / 1) * 1,
          originalData: location
        }));

        setLocations(transformedLocations);
        setLoading(false);
      } catch (err) {
        setError('Failed to load locations. Please try again later.');
        setLoading(false);
        console.error('Error fetching locations:', err);
      }
    };

    fetchLocations();
  }, []);

  const handleLocationClick = async (location) => {
    setSelectedLocation(location);
    if (locationDetails?.id === location.id) return;

    try {
      const response = await axios.get(`/api/vietnam-vr/${location.id}`);
      setLocationDetails(response.data);
    } catch (err) {
      console.error('Error fetching location details:', err);
    }
  };

  const startVRExperience = async () => {
    try {
      if (localStorage.getItem('token')) {
        await axios.post(`/api/vietnam-vr/${selectedLocation.id}/start`, {}, {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });
      }
      setShowVR(true);
    } catch (err) {
      console.error('Error starting VR experience:', err);
    }
  };

  const exitVRExperience = async () => {
    if (localStorage.getItem('token') && showVR) {
      try {
        await axios.put(`/api/vietnam-vr/${selectedLocation.id}/complete`, {}, {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });
      } catch (err) {
        console.error('Error completing VR experience:', err);
      }
    }

    setShowVR(false);
    setSelectedLocation(null);
    setLocationDetails(null);
  };

  if (showVR && selectedLocation) {
    return <VRExperience location={selectedLocation} onExit={exitVRExperience} />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <Header />

      <div className="container mx-auto px-4 py-8 flex-grow">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Try Again
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-center mb-6 text-white opacity-0 animate-fadeInDown">
              Explore Historical Vietnam
            </h1>
            <p className="text-center mb-8 max-w-2xl mx-auto text-white opacity-0 animate-fadeInUp delay-200">
              Click on a location to begin your virtual journey through Vietnam's rich history.
              Experience the culture, architecture, and stories from different regions.
            </p>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-zoomIn"
                 style={{ backgroundImage: `url(${vrGif})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
              <div className="h-[600px] relative">
                <VietnamMap
                  mapImageUrl="/images/vietMap.png"
                  locations={locations}
                  onLocationClick={handleLocationClick}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Click on a marker to view location details and start a VR experience.
              </p>
            </div>
          </>
        )}
      </div>

      {selectedLocation && locationDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4 animate-fadeInUp">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-green-800">{locationDetails.name}</h2>
                <button onClick={() => setLocationDetails(null)} className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {locationDetails.thumbnailImage && (
                <div className="mt-4">
                  <img src={locationDetails.thumbnailImage} alt={locationDetails.name} className="w-full h-64 object-cover rounded-lg" />
                </div>
              )}
              <div className="mt-4">
                {/* <div className="flex items-center mb-2">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mr-2">
                    {locationDetails.region} Region
                  </span>
                  <span className="text-gray-600 text-sm">
                    {locationDetails.province}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{locationDetails.description}</p>
                {locationDetails.historicalContext && (
                  <div className="mb-4">
                    <h3 className="font-bold text-green-700 mb-2">Historical Context</h3>
                    <p className="text-gray-700">{locationDetails.historicalContext}</p>
                  </div>
                )}
                {locationDetails.culturalSignificance && (
                  <div className="mb-4">
                    <h3 className="font-bold text-green-700 mb-2">Cultural Significance</h3>
                    <p className="text-gray-700">{locationDetails.culturalSignificance}</p>
                  </div>
                )} */}
                <button
                  onClick={startVRExperience}
                  className="w-full mt-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition duration-200 shadow-md hover:scale-105 animate-pulseGlow"
                >
                  Start VR Experience
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VRPage;
