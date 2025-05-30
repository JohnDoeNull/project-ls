import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/PrivateRoute';
import VRPage from './pages/VrPage';
import StoriesPage from './pages/StoriesPage';
import TRexGamePage from './pages/TrexGamePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/features" element={<div className="p-10 text-center text-2xl">Features Page Coming Soon</div>} />
          <Route path="/about" element={<div className="p-10 text-center text-2xl">About Page Coming Soon</div>} />
          <Route path="/contact" element={<div className="p-10 text-center text-2xl">Contact Page Coming Soon</div>} />
          <Route path="/forgot-password" element={<div className="p-10 text-center text-2xl">Forgot Password Page Coming Soon</div>} />
          
          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<div className="p-10 text-center text-2xl">Profile Page Coming Soon</div>} />
            <Route path="/explore-vr" element={<VRPage />} />
            <Route path="/comics" element={<div className="p-10 text-center text-2xl">Comics Coming Soon</div>} />
            <Route path="/games" element={<TRexGamePage />} />
            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/chatbot" element={<div className="p-10 text-center text-2xl">Chatbot AI Coming Soon</div>} />
          </Route>
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-screen">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p className="text-xl mb-8">Page not found</p>
              <a href="/" className="text-blue-600 hover:underline">Return home</a>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;