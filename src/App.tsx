import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard"; // Import the Dashboard component
import CMS from "./pages/CMS"; // Import the CMS component
import './App.css';

function App() {
  // Detect if the device is mobile
  const isMobile = window.innerWidth <= 768; // Simple mobile detection logic (can be customized)
  
  // Get the dark mode state (this could be set dynamically or fetched from localStorage)
  const isDarkMode = localStorage.getItem("darkMode") === "false"; 

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Route for Dashboard */}
          <Route path="/" element={<Dashboard isMobile={isMobile} isDarkMode={isDarkMode} />} />
          
          {/* Route for CMS */}
          <Route path="/cms" element={<CMS />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
