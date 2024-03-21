// Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import OffCanvasMenu from './OffCanvasMenu';

const Navbar = () => {
  const [currentstate, setCurrentState] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginClick = () => {
    setCurrentState("login");
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  return (
    <div className="navbar">
      <div className="logo">
        <h1><Link to="/"><img src="\images\logo.PNG" alt="logo" /></Link></h1>
      </div>
      <ul className="nav-links">
        <li><p onClick={() => setCurrentState("services")}>Services</p></li>
        <li><p onClick={handleLoginClick}>Login</p></li>
      </ul>
      {showLogin && <OffCanvasMenu onClose={handleCloseLogin} />}
    </div>
  );
}

export default Navbar;
