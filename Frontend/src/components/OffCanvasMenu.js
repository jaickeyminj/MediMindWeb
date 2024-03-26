import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserLoginOffcanvas from './UserLoginOffcanvas';
import ConsultantLoginOffcanvas from './ConsultantLoginOffcanvas';

const OffCanvasMenu = ({ onClose }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showMenu, setShowMenu] = useState(true);

  useEffect(() => {
    const checkLoggedInStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch('http://localhost:27017/api/v1/patient/validateTokenPatient', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            setIsLoggedIn(true);
            setShowMenu(false);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoading(false);
        // Handle error, maybe show a generic error message to the user
      }
    };

    checkLoggedInStatus();
  }, []);

  const handleCloseMenu = () => {
    setShowMenu(false);
    onClose(); // Call onClose to close the entire off-canvas
  };

  const handleLoginOptionSelect = (option) => {
    setSelectedOption(option);
    if (option === 'patient' || option === 'consultant') {
      setShowMenu(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`offcanvas-container ${showMenu ? 'show' : ''}`}>
      <div className="offcanvas">
        <button className="close-btn" onClick={handleCloseMenu}>X</button>
        {isLoggedIn ? (
          <Link to="/patientdashboard">
            <h2>Go to Patient Dashboard</h2>
          </Link>
        ) : (
          <>
            <h2>Login Options</h2>
            <div className="login-options">
              <label>
                <input
                  type="radio"
                  name="loginOption"
                  value="patient"
                  checked={selectedOption === 'patient'}
                  onChange={() => handleLoginOptionSelect('patient')}
                />
                Patient Login
              </label>
              <label>
                <input
                  type="radio"
                  name="loginOption"
                  value="consultant"
                  checked={selectedOption === 'consultant'}
                  onChange={() => handleLoginOptionSelect('consultant')}
                />
                Consultant Login
              </label>
            </div>
            {selectedOption === 'patient' && <UserLoginOffcanvas onClose={onClose} />}
            {selectedOption === 'consultant' && <ConsultantLoginOffcanvas onClose={onClose} />}
          </>
        )}
      </div>
    </div>
  );
};

export default OffCanvasMenu;
