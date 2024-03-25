import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

const PatientDashboard = () => {
  return (
    <div className="container">
      <div className="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li><Link to="/search-doctors">Search Doctors</Link></li>
          <li><Link to="/disease-prediction">Disease Prediction</Link></li>
          <li><Link to="/medical-reports">Medical Reports</Link></li>
          <li><Link to="/update-profile">Update Profile</Link></li>
          {/* Add more navigation options here */}
        </ul>
      </div>
      <div className="content">
        {/* Content will be displayed here based on the selected option */}
        <h2>Welcome to Patient Dashboard</h2>
      </div>
    </div>
  );
};

export default PatientDashboard;
