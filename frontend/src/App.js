// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home/Home'; // Adjust path if needed
import Signin from './Register/Signin';
import Signup from './Register/Signup';
import Navbar from './Navbar/Navbar';
import FileUploadPage from './Home2/Home2'; // Adjust path if needed

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home page */}
        <Route path="/Register/Signin" element={<Signin />} />
        <Route path="/Register/Signup" element={<Signup />} />
        {/* Update this path to /file-upload */}
        <Route path="/file-upload" element={<FileUploadPage />} />
      </Routes>
    </Router>
  );
}

export default App;
