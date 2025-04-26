// Let's glow up this TRexGamePage
// We'll focus on modern UI/UX: glassmorphism, animations, clean layout, and vibe

import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import backgroundImage from '../assets/images/homepagebg3.jpg';
import { UserService } from '../api/services';

const TRexGamePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [iframeKey, setIframeKey] = useState(Date.now());
  const [showHighScoresModal, setShowHighScoresModal] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    fetchMyScore();
    const handleGameMessage = (event) => {
      if (event.data?.type === 'TREX_SCORE') {
        setScore(event.data.score);
        if (event.data.score > highScore) {
          setHighScore(event.data.score);
          localStorage.setItem('trexHighScore', event.data.score.toString());
        }
      }
      if (event.data?.type === 'TREX_GAME_START') setGameStarted(true);
      if (event.data?.type === 'TREX_GAME_OVER') setGameStarted(false);
    };
    window.addEventListener('message', handleGameMessage);
    return () => window.removeEventListener('message', handleGameMessage);
  }, [highScore]);

  const fetchMyScore = async () => {
    try {
      const response = await UserService.myTrexHighScore();
      setHighScore(response.score || 0);
    } catch (err) {
      console.error('Error fetching my score:', err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLeaderboardLoading(true);
      const response = await UserService.getTrexHighScore();
      setLeaderboardData(response || []);
      setLeaderboardLoading(false);
    } catch (err) {
      console.error('Error fetching leaderboard data:', err);
      setLeaderboardLoading(false);
    }
  };

  useEffect(() => {
    if (showHighScoresModal) fetchLeaderboard();
  }, [showHighScoresModal]);

  const restartGame = () => {
    setIframeKey(Date.now());
    setScore(0);
  };

  return (
    <div
      className="min-h-screen flex flex-col backdrop-blur-md bg-black/50 text-white"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-400 border-solid"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4 text-lg font-semibold animate-pulse">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg shadow-lg hover:scale-105 transition">
              Try Again
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-5xl font-extrabold text-center mb-4 tracking-tight animate-fadeInDown">🚀 T-Rex Runner</h1>
            <p className="text-center mb-6 text-lg text-gray-200 animate-fadeInUp">Jump, Duck, Survive — and Answer to Revive 🧠</p>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl animate-zoomIn border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-bold text-orange-400">High Score: {highScore}</div>
                <button onClick={() => setShowHighScoresModal(true)} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-medium shadow-md transition duration-150">
                  🏆 Leaderboard
                </button>
              </div>

              <div className="relative">
                <iframe
                  key={iframeKey}
                  ref={iframeRef}
                  src="/game/trex/index.html"
                  title="T-Rex Game"
                  className="w-full h-96 border-0"
                  sandbox="allow-scripts allow-same-origin allow-modals"
                  allow="autoplay"
                />
              </div>

              <div className="flex justify-center mt-6">
                <button onClick={restartGame} className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-red-500 text-white font-bold rounded-lg transition hover:scale-105 shadow-lg">
                  🔄 Restart
                </button>
              </div>

              <div className="mt-6 p-4 bg-white/10 rounded-xl">
                <h3 className="font-bold text-lg mb-2">🎮 Controls</h3>
                <ul className="list-disc pl-5 text-sm text-gray-200">
                  <li>Jump: <span className="font-mono bg-gray-800 px-2 py-1 rounded">Space</span> / <span className="font-mono bg-gray-800 px-2 py-1 rounded">↑</span></li>
                  <li>Duck: <span className="font-mono bg-gray-800 px-2 py-1 rounded">↓</span></li>
                  <li>Answer quiz when you crash to keep going!</li>
                </ul>
              </div>
            </div>

            {showHighScoresModal && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
                <div className="bg-white text-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4 animate-fadeInUp">
                  <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="text-xl font-bold">🏆 Leaderboard</h3>
                    <button onClick={() => setShowHighScoresModal(false)} className="text-gray-500 hover:text-gray-700">
                      ✖️
                    </button>
                  </div>
                  <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {leaderboardLoading ? (
                      <div className="py-6 text-center">Loading...</div>
                    ) : leaderboardData.length === 0 ? (
                      <div className="py-6 text-center text-gray-500">No scores yet!</div>
                    ) : (
                      <ol className="space-y-3">
                        {leaderboardData.map((entry, index) => (
                          <li key={index} className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
                            <span className="font-bold text-sm text-gray-700">{index + 1}. {entry.username || 'Anonymous'}</span>
                            <span className="text-orange-500 font-semibold">{entry.score.toLocaleString()}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                  <div className="px-4 py-3 bg-gray-100 rounded-b-lg text-right">
                    <button onClick={() => setShowHighScoresModal(false)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Close</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TRexGamePage;
