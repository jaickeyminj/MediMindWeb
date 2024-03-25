import React, { useState } from 'react';
import UserLoginOffcanvas from './UserLoginOffcanvas';
import ConsultantLoginOffcanvas from './ConsultantLoginOffcanvas';

const OffCanvasMenu = ({ onClose }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showMenu, setShowMenu] = useState(true);

  const handleLoginOptionSelect = (option) => {
    setSelectedOption(option);
    if (option === 'patient' || option === 'consultant') {
      setShowMenu(false);
    }
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
    onClose(); // Call onClose to close the entire off-canvas
  };

  return (
    <div className={`offcanvas-container ${showMenu ? 'show' : ''}`}>
      <div className="offcanvas">
        <button className="close-btn" onClick={handleCloseMenu}>X</button>
        {showMenu ? (
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
          </>
        ) : null}
        {selectedOption === 'patient' && <UserLoginOffcanvas onClose={onClose} />}
        {selectedOption === 'consultant' && <ConsultantLoginOffcanvas onClose={onClose} />}
      </div>
    </div>
  );
};

export default OffCanvasMenu;
