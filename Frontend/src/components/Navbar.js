// Navbar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PatientDashboard from './PatientDashboard';
import ConsultantDashboard from './ConsultantDashboard';
import UserLoginOffcanvas from './UserLoginOffcanvas';
import ConsultantLoginOffcanvas from './ConsultantLoginOffcanvas';

const Navbar = () => {
  const [isPatientLoggedIn, setPatientLoggedIn] = useState(false);
  const [isConsultantLoggedIn, setConsultantLoggedIn] = useState(false);
  const [showPatientLogin, setShowPatientLogin] = useState(false);
  const [showConsultantLogin, setShowConsultantLogin] = useState(false);

  useEffect(() => {
    const checkLoggedInStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const responsePatient = await fetch('http://localhost:27017/api/v1/patient/validateTokenPatient', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (responsePatient.ok) {
            setPatientLoggedIn(true);
          } else {
            const responseConsultant = await fetch('http://localhost:27017/api/v1/consultant/validateTokenConsultant', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if (responseConsultant.ok) {
              setConsultantLoggedIn(true);
            }
          }
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoggedInStatus();
  }, []);

  const handlePatientLoginClick = () => {
    setShowPatientLogin(true);
  };

  const handleConsultantLoginClick = () => {
    setShowConsultantLogin(true);
  };

  const handlePatientCloseLogin = () => {
    setShowPatientLogin(false);
  };

  const handleConsultantCloseLogin = () => {
    setShowConsultantLogin(false);
  };

  return (
    <div>
      <div className="navbar">
        <div className="logo">
          <h1><Link to="/"><img src="/images/logo.png" alt="logo" /></Link></h1>
        </div>
        <ul className="auth-options">
        <Link to="/services">Services</Link>
          <Link to="/patient">Patient</Link>
          <Link to="/consultant">Consultant</Link>
        </ul>
        {showPatientLogin && (
          <UserLoginOffcanvas onClose={handlePatientCloseLogin} />
        )}
        {showConsultantLogin && (
          <ConsultantLoginOffcanvas onClose={handleConsultantCloseLogin} />
        )}
      </div>
      )
    </div>
  );
}

export default Navbar;