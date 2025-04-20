import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const VRExperience = ({ location, onExit }) => {
  // Initial setup - fetch location data and start tracking    
  if (!location) {
    return (
      <div className="flex justify-center items-center h-screen bg-black bg-opacity-75">
        <div className="bg-white p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Location Not Found</h3>
          <button 
            onClick={onExit} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Map
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen w-full relative bg-black">
      {/* Matterport iframe */}
      <iframe
        src={location.originalData.vrContent?.matterportId}
        id="iframeId"
        allow="fullscreen; accelerometer; gyroscope"
        className="w-full h-full"
        title="Matterport VR Experience"
      ></iframe>

      {/* Exit button */}
      <button 
        onClick={onExit} 
        className="absolute top-4 right-4 bg-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-gray-100 transition-colors z-10"
      >
        EXIT
      </button>
    </div>
  );
};

export default VRExperience;