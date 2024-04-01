import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UpdateAvailableTime from './UpdateAvailbleTime';
import GetAppointments from './GetAppointments';
import ScheduledAppointments from './ScheduledAppointments';
const ConsultantDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointment_requests');
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

        const response = await fetch('http://3.111.21.73:27017/api/v1/consultant/validateTokenConsultant', {
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
              <li className={activeTab === 'appointment_requests' ? 'active' : ''} onClick={() => handleTabChange('appointment_requests')}>Appointment Requests</li>
              <li className={activeTab === 'scheduled_appointments' ? 'active' : ''} onClick={() => handleTabChange('scheduled_appointments')}>Scheduled Appointments</li>
              <li className={activeTab === 'update_time' ? 'active' : ''} onClick={() => handleTabChange('update-time')}>Update Available Time</li>
              <li onClick={handleLogout}><Link to="/">Logout</Link></li>
              {/* Add more navigation options here */}
            </ul>
          </div>
          <div className="container">
            <div className="content">
              {activeTab === 'appointment_requests' && <GetAppointments/>}
              {activeTab === 'scheduled_appointments' && <ScheduledAppointments/>}
              {activeTab === 'update_time' && <UpdateAvailableTime/>}
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
