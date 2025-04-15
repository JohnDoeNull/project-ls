import React, { useState, useEffect } from 'react';
import VietnamMap from './VietnamMap';
import VRExperience from './VRExperience'; // This would be your VR component
import axios from 'axios';

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
        const response = await axios.get('/api/vietnam-vr?category=historical');
        
        // Transform the backend data to match the VietnamMap component format
        const transformedLocations = response.data.data.map(location => ({
          id: location._id,
          name: location.name,
          description: location.shortDescription,
          // Convert absolute pixel coordinates to percentage for the map
          // You may need to adjust these calculations based on your map dimensions
          x: (location.coordinates.x / 600) * 100, // assuming map width is 600px
          y: (location.coordinates.y / 800) * 100, // assuming map height is 800px
          // Store the original data for detail view
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
    
    // If we already have details, don't fetch again
    if (locationDetails?.id === location.id) return;
    
    try {
      // Fetch detailed information about the location
      const response = await axios.get(`/api/vietnam-vr/${location.id}`);
      setLocationDetails(response.data.data);
    } catch (err) {
      console.error('Error fetching location details:', err);
    }
  };

  const startVRExperience = async () => {
    try {
      // Notify backend that user started a VR experience (if user is logged in)
      if (localStorage.getItem('token')) {
        await axios.post(`/api/vietnam-vr/${selectedLocation.id}/start`, {}, {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });
      }
      
      // Show VR experience
      setShowVR(true);
    } catch (err) {
      console.error('Error starting VR experience:', err);
    }
  };

  const exitVRExperience = async () => {
    // If user is logged in, complete the VR experience in the backend
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Display VR experience if a location is selected and VR mode is active
  if (showVR && selectedLocation) {
    return (
      <VRExperience 
        locationId={selectedLocation.id} 
        onExit={exitVRExperience}
        // Pass any additional props needed by your VR component
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-800">
        Explore Historical Vietnam
      </h1>
      <p className="text-center mb-8 max-w-2xl mx-auto">
        Click on a location to begin your virtual journey through Vietnam's rich history. 
        Experience the culture, architecture, and stories from different regions.
      </p>
      
      {/* Vietnam Map Component */}
      <VietnamMap
        mapImageUrl="/images/vietnam-map.jpg" // Update with your map path
        locations={locations}
        onLocationClick={handleLocationClick}
      />
      
      {/* Location Details Modal */}
      {selectedLocation && locationDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-green-800">{locationDetails.name}</h2>
                <button 
                  onClick={() => setLocationDetails(null)} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Location Image */}
              {locationDetails.thumbnailImage && (
                <div className="mt-4">
                  <img 
                    src={locationDetails.thumbnailImage} 
                    alt={locationDetails.name} 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
              
              {/* Location Info */}
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mr-2">
                    {locationDetails.region} Region
                  </span>
                  <span className="text-gray-600 text-sm">
                    {locationDetails.province}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4">
                  {locationDetails.description}
                </p>
                
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
                )}
                
                <button
                  onClick={startVRExperience}
                  className="w-full mt-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition duration-200 shadow-md"
                >
                  Start VR Experience
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Region Legend */}
      <div className="mt-8 bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold mb-2">Regions of Vietnam:</h3>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center">
            <span className="w-4 h-4 inline-block bg-red-500 rounded-full mr-2"></span>
            <span>North</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 inline-block bg-blue-500 rounded-full mr-2"></span>
            <span>Central</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 inline-block bg-green-500 rounded-full mr-2"></span>
            <span>South</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 inline-block bg-yellow-600 rounded-full mr-2"></span>
            <span>Highlands</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VRPage;