import React, { useState, useEffect } from 'react';

const VietnamMap = ({ 
  mapImageUrl, 
  locations = [],
  onLocationClick = () => {} 
}) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading map image
    if (mapImageUrl) {
      const img = new Image();
      img.onload = () => setIsLoading(false);
      img.onerror = () => console.error("Error loading map image");
      img.src = mapImageUrl;
    }
  }, [mapImageUrl]);

  const handleLocationClick = (location) => {
    setSelectedLocation(location.id === selectedLocation?.id ? null : location);
    onLocationClick(location);
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
            <div className="relative">
              <img 
                src={mapImageUrl || "/api/placeholder/800/600"} 
                alt="Map of Vietnam" 
                className="w-full object-contain"
              />
              
              {/* Location Markers Overlay */}
              <div className="absolute top-0 left-0 w-full h-full">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{ 
                      left: `${location.x}%`, 
                      top: `${location.y}%` 
                    }}
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
                    
                    {selectedLocation?.id === location.id && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10">
                        <div className="bg-white p-3 rounded-lg shadow-lg min-w-[160px]">
                          <h3 className="font-bold text-sm">{location.name}</h3>
                          {location.description && (
                            <p className="text-xs mt-1 text-gray-600">{location.description}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Exit button */}
        <div className="absolute top-4 right-4">
          <button className="bg-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-gray-100 transition-colors">
            EXIT
          </button>
        </div>
      </div>
      
      {/* Usage instructions */}
      <div className="mt-4 bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold text-lg mb-2">How to use this component:</h3>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
{`// Example usage:
const locationData = [
  { 
    id: 1, 
    name: "Hanoi", 
    description: "Capital city of Vietnam",
    x: 25, // Percentage position on the map image (from left)
    y: 20  // Percentage position on the map image (from top)
  },
  { 
    id: 2, 
    name: "Ho Chi Minh City", 
    description: "Largest city in Vietnam",
    x: 30, 
    y: 75
  },
  { 
    id: 3, 
    name: "Da Nang", 
    description: "Coastal city in central Vietnam",
    x: 35, 
    y: 45
  }
];

<VietnamMap 
  mapImageUrl="/path/to/your/vietnam-map.jpg"
  locations={locationData}
  onLocationClick={(location) => console.log("Selected:", location)} 
/>`}
        </pre>
      </div>
    </div>
  );
};

export default VietnamMap;