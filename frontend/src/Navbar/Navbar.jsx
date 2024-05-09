import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import image1 from './logo.png'

function Navbar() {
  const navigate = useNavigate();


  const handleHomeButtonClick = () => {
    navigate('/');
  };


  const handleAuthButtonClick = () => {
    navigate('/Register/Signin');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={image1}   className="logo" /> 
        <span className="site-name">VISUALYTICS</span>
      </div>
      <div className="navbar-right">
        <button onClick={handleHomeButtonClick} className="navbar-button">Home</button>
        <button onClick={handleAuthButtonClick} className="navbar-button">Sign In / Sign Out</button>
      </div>
    </nav>
  );
}

export default Navbar;
