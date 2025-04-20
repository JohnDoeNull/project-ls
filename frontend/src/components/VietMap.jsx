import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const VietnamMap = ({ 
  mapImageUrl, 
  locations = [],
  onLocationClick = () => {} 
}) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });
  const mapContainerRef = useRef(null);
  
  useEffect(() => {
    // Load map image and get dimensions
    if (mapImageUrl) {
      const img = new Image();
      img.onload = () => {
        setIsLoading(false);
        updateMapDimensions();
      };
      img.onerror = () => console.error("Error loading map image");
      img.src = mapImageUrl;
    }
  }, [mapImageUrl]);

  // Add window resize listener
  useEffect(() => {
    updateMapDimensions();
    window.addEventListener('resize', updateMapDimensions);
    return () => window.removeEventListener('resize', updateMapDimensions);
  }, []);
  
  // Update map dimensions based on actual rendered size
  const updateMapDimensions = () => {
    if (mapContainerRef.current) {
      const { width, height } = mapContainerRef.current.getBoundingClientRect();
      setMapDimensions({ width, height });
    }
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location.id === selectedLocation?.id ? null : location);
    onLocationClick(location);
  };

  const handleMouseEnter = (location) => {
    setHoveredLocation(location);
  };

  const handleMouseLeave = () => {
    setHoveredLocation(null);
  };

  const navigate = useNavigate();

  const handleExit = () => {
    navigate('/dashboard'); // Replace with your actual dashboard route
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="bg-gray-200 w-full h-96 flex items-center justify-center">
            <p className="text-gray-500">Loading map...</p>
          </div>
        ) : (
          <div className="relative">
            {/* Map Image Container */}
            <div className="relative" ref={mapContainerRef}>
              <img 
                src={mapImageUrl || "/api/placeholder/800/600"} 
                alt="Map of Vietnam" 
                className="w-full object-contain"
                onLoad={updateMapDimensions}
              />
              
              {/* Location Markers Overlay */}
              <div className="absolute top-0 left-0 w-full h-full">
                {locations.map((location) => {
                  // Get coordinates, supporting both formats
                  const x = location.coordinates ? location.coordinates.x : location.x;
                  const y = location.coordinates ? location.coordinates.y : location.y;
                  
                  return (
                    <div
                      key={location.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ 
                        left: `${x}%`, 
                        top: `${y}%` 
                      }}
                    >
                      <div 
                        className="relative"
                        onMouseEnter={() => handleMouseEnter(location)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <button
                          onClick={() => handleLocationClick(location)}
                          className={`
                            w-6 h-6 rounded-full flex items-center justify-center
                            ${selectedLocation?.id === location.id 
                              ? 'bg-red-500 ring-4 ring-red-200' 
                              : 'bg-orange-500 hover:bg-orange-600'} 
                            text-white shadow-lg transition-all duration-300
                            animate-pulse hover:animate-none
                          `}
                          aria-label={`Location: ${location.name}`}
                        >
                          <span className="sr-only">{location.name}</span>
                        </button>
                        
                        {/* Tooltip that only shows on hover */}
                        {hoveredLocation?.id === location.id && (
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10">
                            <div className="bg-white p-3 rounded-lg shadow-lg min-w-[160px] max-w-[250px]">
                              <h3 className="font-bold text-sm">{location.name}</h3>
                              {(location.shortDescription || location.description) && (
                                <p className="text-xs mt-1 text-gray-600">
                                  {location.shortDescription || 
                                  (typeof location.description === 'string' ? 
                                    (location.description.length > 120 ? location.description.substring(0, 120) + '...' : location.description) : 
                                    '')}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        {/* Exit button */}
        <div className="absolute top-4 right-4">
          <button onClick={handleExit} className="bg-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-gray-100 transition-colors">
            EXIT
          </button>
        </div>
      </div>
      
      {/* Map dimensions indicator (for development) */}
      <div className="mt-1 text-xs text-gray-500 text-right">
        Map dimensions: {mapDimensions.width.toFixed(0)} x {mapDimensions.height.toFixed(0)}px
      </div>
    </div>
  );
};

export default VietnamMap;