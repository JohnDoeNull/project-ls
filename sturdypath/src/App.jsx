import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/features" element={<div className="p-10 text-center text-2xl">Features Page Coming Soon</div>} />
        <Route path="/about" element={<div className="p-10 text-center text-2xl">About Page Coming Soon</div>} />
        <Route path="/contact" element={<div className="p-10 text-center text-2xl">Contact Page Coming Soon</div>} />
        <Route path="/login" element={<div className="p-10 text-center text-2xl">Login Page Coming Soon</div>} />
      </Routes>
    </Router>
  );
}

export default App;