import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import VietMap from '../components/VietMap';
import VideoPlayer from '../components/VideoPlayer';
import { UserService } from '../api/services';
import backgroundImage from '../assets/images/homepagebg3.jpg';

const StoriesPage = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    region: '',
    searchTerm: ''
  });

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        // Fetch locations from your API
        const response = await UserService.getMapLocations();
        
        // Filter only locations that have videoUrl (stories)
        const locationsWithStories = response.data.filter(location => 
          location.vrContent && location.vrContent.videoUrl
        );
        
        setLocations(locationsWithStories);
        setFilteredLocations(locationsWithStories);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError('Failed to load locations. Please try again later.');
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Handle location selection from the map or list
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setShowDetails(true);
    // In a real implementation, you might want to increment view count here
  };

  // Close details modal
  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Apply filters to locations
  useEffect(() => {
    let result = locations;
    
    // Filter by category
    if (filters.category) {
      result = result.filter(location => location.category === filters.category);
    }
    
    // Filter by region
    if (filters.region) {
      result = result.filter(location => location.region === filters.region);
    }
    
    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(location => 
        location.name.toLowerCase().includes(searchLower) || 
        location.description.toLowerCase().includes(searchLower) ||
        (location.tags && location.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }
    
    setFilteredLocations(result);
  }, [filters, locations]);

  // Get unique categories and regions for filters
  const categories = [...new Set(locations.map(location => location.category))];
  const regions = [...new Set(locations.map(location => location.region))];

  // Format category name for display
  const formatCategory = (category) => {
    if (!category) return '';
    return category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-4xl font-bold text-center mb-8">Traditional Stories Map</h1>
        
        {/* Filters removed as requested */}

        {/* Main map container */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="h-[600px] relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                <p className="text-red-500">{error}</p>
              </div>
            ) : (
              <VietMap 
                mapImageUrl="/images/vietMap.png" 
                locations={filteredLocations}
                onLocationClick={handleLocationSelect}
              />
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Click on a marker to view the related story details and video.
          </p>
        </div>
        
        {/* Available stories section removed as requested */}
      </div>
      
      {/* Details and Video Modal */}
      {showDetails && selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start p-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold">{selectedLocation.name}</h2>
              <button 
                onClick={handleCloseDetails}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {/* Video player */}
              {selectedLocation.vrContent && selectedLocation.vrContent.videoUrl ? (
                <VideoPlayer 
                  videoUrl={selectedLocation.vrContent.videoUrl}
                  title={selectedLocation.name}
                />
              ) : (
                <div className="bg-gray-100 h-[300px] flex items-center justify-center rounded-lg mb-4">
                  <p>No video content available.</p>
                </div>
              )}
              
              {/* Location details */}
              <div className="mt-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedLocation.category && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {formatCategory(selectedLocation.category)}
                    </span>
                  )}
                  {selectedLocation.region && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {selectedLocation.region}
                    </span>
                  )}
                  {selectedLocation.province && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      {selectedLocation.province}
                    </span>
                  )}
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full ml-auto">
                    {selectedLocation.viewCount || 0} views
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4">{selectedLocation.description}</p>
                
                {selectedLocation.shortDescription && selectedLocation.shortDescription !== selectedLocation.description && (
                  <p className="text-gray-600 italic mb-4">{selectedLocation.shortDescription}</p>
                )}
                
                {selectedLocation.historicalContext && (
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-800">Historical Context</h3>
                    <p className="text-gray-700">{selectedLocation.historicalContext}</p>
                  </div>
                )}
                
                {selectedLocation.culturalSignificance && (
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-800">Cultural Significance</h3>
                    <p className="text-gray-700">{selectedLocation.culturalSignificance}</p>
                  </div>
                )}
                
                {selectedLocation.tags && selectedLocation.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {selectedLocation.tags.map(tag => (
                      <span key={tag} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer with copyright removed as requested */}
    </div>
  );
};

export default StoriesPage;