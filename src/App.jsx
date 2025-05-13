import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Components
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

// Pages
import Home from './pages/Home/Home';
import Solver from './pages/Solver/Solver';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import DemoSolver from './pages/DemoSolver/DemoSolver';
import PreviousEquations from './pages/PreviousEquations/PreviousEquations';
import MoleculeViewerPage from './pages/MoleculeViewerPage/MoleculeViewerPage';

// Custom Protected Route Component
const ProtectedRoute = ({ isAuthenticated, isValidating, children }) => {
  const location = useLocation();
  
  // If we're still validating the token, show a loading state or null
  if (isValidating) {
    return <div>Loading...</div>; // You can replace with a loading spinner component
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [user, setUser] = useState(null);

  // Function to validate token and set authentication state
  const validateToken = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsAuthenticated(false);
      setIsValidating(false);
      return;
    }
    
    try {
      // Configure axios with the token
      const response = await axios.get('https://chemsolve-backend.onrender.com/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    // Validate token on app load
    validateToken();
    
    // Don't remove token on tab close anymore - this was causing issues with refreshes
    // We'll handle logout explicitly instead
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app">
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/demosolver" element={<DemoSolver />} />
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                <Navigate to="/solver" /> : 
                <Login setIsAuthenticated={setIsAuthenticated} validateToken={validateToken} />
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? 
                <Navigate to="/solver" /> : 
                <Register />
              } 
            />
            <Route
              path="/solver"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} isValidating={isValidating}>
                  <Solver />
                </ProtectedRoute>
              }
            />
            <Route
              path="/previousEquations"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} isValidating={isValidating}>
                  <PreviousEquations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/moleculeViewer"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} isValidating={isValidating}>
                  <MoleculeViewerPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;