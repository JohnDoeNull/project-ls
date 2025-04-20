import React, { useState } from 'react';
import PropTypes from 'prop-types';

const VideoPlayer = ({ videoUrl, title }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create YouTube or Vimeo embed URL
  const getEmbedUrl = (url) => {
    if (!url) return '';
    
    // Handle YouTube URLs
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('watch?v=')[1].split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Handle Vimeo URLs
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1].split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    
    return url;
  };

  // Handle iframe loading events
  const handleIframeLoad = () => {
    setLoading(false);
  };

  // Handle errors
  const handleIframeError = () => {
    setLoading(false);
    setError('Failed to load video. Please try again later.');
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="video-player-container">
      <div className="relative pb-[56.25%] h-0">
        {/* Loading indicator */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-700">Loading video...</p>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
            <div className="text-center p-4">
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        {/* Video iframe */}
        <iframe 
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={embedUrl}
          title={title || 'Video Player'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        ></iframe>
      </div>
    </div>
  );
};

VideoPlayer.propTypes = {
  videoUrl: PropTypes.string.isRequired,
  title: PropTypes.string
};

export default VideoPlayer;