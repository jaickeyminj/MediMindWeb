import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ConsultantDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState(""); 

  useEffect(() => {
    // Function to validate token when component mounts
    const validateToken = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoggedIn(false);
          return;
        }

        const response = await fetch('http://localhost:27017/api/v1/consultant/validateTokenConsultant', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setLoggedIn(true);
          const name = localStorage.getItem('name');
          setName(name);
        } else {
          setLoggedIn(false);
          // Optionally, you can redirect to a login page here
        }
      } catch (error) {
        console.error('Error validating token:', error);
        setLoggedIn(false);
        // Optionally, you can show an error message here
      }
    };

    validateToken();
  }, []); // Empty dependency array to ensure effect runs only once on mount

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const handleLogout = () => {
    // Clear local storage and set logged in state to false
    localStorage.removeItem('name');
    localStorage.removeItem('_id');
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  return (
    <div className='devider'>
      {loggedIn ? (
        <>
          <div className="sidebar">
            <ul>
              <div className="logo">
                <h1><Link to="/"><img src="/images/logo.png" alt="logo" /></Link></h1>
              </div>
              <li><h3>Welcome {name}</h3></li>
              <li className={activeTab === 'appointments' ? 'active' : ''} onClick={() => handleTabChange('appointments')}>Appointments</li>
              <li className={activeTab === 'update-time' ? 'active' : ''} onClick={() => handleTabChange('update-time')}>Update Available Time</li>
              <li onClick={handleLogout}><Link to="/">Logout</Link></li>
              {/* Add more navigation options here */}
            </ul>
          </div>
          <div className="container">
            <div className="content">
              {activeTab === 'appointments' && <h2>Appointments</h2>}
              {activeTab === 'update-time' && <h2>Update Available Time</h2>}
              {/* Add content for additional tabs */}
            </div>
          </div>
        </>
      ) : (
        <div>
          <h2>You are not logged in. Go for Login</h2>
          <Link as="button" to="/"><h3>here</h3></Link>
          {/* Optionally, you can add a login form or redirect to a login page */}
        </div>
      )}
    </div>
  );
};

export default ConsultantDashboard;
