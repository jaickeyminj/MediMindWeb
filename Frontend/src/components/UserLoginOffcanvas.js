import React, { useState, useEffect } from 'react';
import PatientDashboard from './PatientDashboard';
import { Link } from 'react-router-dom';
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
          const response = await fetch('http://medimind.in.net:27017/api/v1/patient/validateTokenPatient', {
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
      const response = await fetch('http://medimind.in.net:27017/api/v1/patient/login', {
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
  
  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobileNo || !formData.bloodGroup || !formData.dob || !formData.password || !formData.gender || !formData.address.city || !formData.address.state || !formData.address.country) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('http://medimind.in.net:27017/api/v1/patient/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Registration successful!');
      } else {
        const errorData = await response.json();
        alert('Registration failed: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Registration failed. Please try again later.');
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
            <Link to="/"><button className="close-btn" onClick={handleCloseMenu}>X</button></Link>
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
                <form onSubmit={handleRegistrationSubmit}>
                <h2>User Registration</h2>
                <div className="form-group">
                  <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <input type="text" name="mobileNo" placeholder="Mobile Number" value={formData.mobileNo} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required>
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div className="form-group">
                  <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <div className='date'>
                  <label><p>Date Of Birth</p></label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} placeholder="Date Of Birth" required />
                  </div>
                </div>
                <div className="form-group">
                  <input type="text" name="address.city" placeholder="City" value={formData.address.city} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <input type="text" name="address.state" placeholder="State" value={formData.address.state} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <input type="text" name="address.country" placeholder="Country" value={formData.address.country} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <input type="password" name="password" placeholder="Set Password" value={formData.password} onChange={handleChange} required />
                </div>
                <button type="submit">Register</button>
                <p onClick={toggleMode}>Already registered? Login here.</p>
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
