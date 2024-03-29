import React, { useState, useEffect } from 'react';
import PatientDashboard from './PatientDashboard';

const UserLoginOffcanvas = ({ onClose }) => {
  const [loginMode, setLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    mobileNo: '',
    bloodGroup: '',
    gender: '',
    dob: '',
    address: {
      city: '',
      state: '',
      country: ''
    }
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [showCanvas, setShowCanvas] = useState(true); // Control visibility of off-canvas menu
  const [redirectToHome, setRedirectToHome] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:27017/api/v1/patient/validateTokenPatient', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            setLoggedIn(true);
          }
        } catch (error) {
          console.error('Error checking login status:', error);
        }
      }
    };

    checkLoggedIn();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prevState => ({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:27017/api/v1/patient/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('_id', data.patient._id);
        localStorage.setItem('name', data.patient.name);
        setLoggedIn(true);
        setShowCanvas(false);
      } else {
        const errorData = await response.json();
        alert('Login failed: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Login failed. Please try again later.');
    }
  };

  const toggleMode = () => {
    setLoginMode(!loginMode);
  };

  useEffect(() => {
    if (loggedIn) {
      setShowCanvas(false);
      setRedirectToHome(true);
    }
  }, [loggedIn]);

  const handleCloseMenu = () => {
    setShowCanvas(false);
    if (onClose) {
      onClose();
    }
    setRedirectToHome(true); // Set to true to redirect to home
  };

  const toggleCanvas = () => {
    setShowCanvas(prevState => !prevState);
  };

  return (
    <div>
      {showCanvas && (
        <div className={`offcanvas-container ${showCanvas ? 'show' : ''}`}>
          <div className="offcanvas" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleCloseMenu}>X</button>
            <>
              {loginMode ? (
                <form onSubmit={handleLoginSubmit}>
                  <h2>User Login</h2>
                  <div className="form-group">
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                  </div>
                  <button type="submit">Login</button>
                  <p onClick={toggleMode}> Not registered yet? Register here.</p>
                </form>
              ) : (
                <form>
                  <h2>User Registration</h2>
                  {/* Rest of the registration form */}
                </form>
              )}
            </>

          </div>
        </div>
      )}
      {redirectToHome && (
        <PatientDashboard />
      )}
    </div>
  );
};

export default UserLoginOffcanvas;
