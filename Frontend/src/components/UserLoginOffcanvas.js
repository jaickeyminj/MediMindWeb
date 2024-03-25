import React, { useState } from 'react';

const UserLoginOffcanvas = ({ onClose }) => {
  const [loginMode, setLoginMode] = useState(true); // State to toggle between login and registration mode
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    mobileNo: '',
    bloodGroup: '',
    gender: '', // New field
    dob: '',
    address:{
      city: 'ss',
      state: 'dsd',
      country: 'dasd'
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    // Add your login submission logic here
    console.log('Login:', formData.email, formData.password);
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if (!formData.name || !formData.email || !formData.mobile || !formData.bloodGroup || !formData.dob || !formData.password || !formData.gender || !formData.address.city || !formData.address.state || !formData.address.country) {
      alert('Please fill in all fields.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:27017/api/v1/patient/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // Registration successful
        alert('Registration successful!');
        // Optionally, you can redirect the user or perform any other actions here
      } else {
        // Handle error response
        const errorData = await response.json();
        alert('Registration failed: ' + errorData.message);
      }
    } catch (error) {
      // Handle network errors
      console.error('Error:', error);
      alert('Registration failed. Please try again later.');
    }
  };

  const toggleMode = () => {
    setLoginMode(!loginMode);
  };

  return (
    <div className="offcanvas-container" onClick={onClose}>
      <div className="offcanvas" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>
        {loginMode ? (
          <>
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
          </>
        ) : (
          <>
            <form onSubmit={handleRegistrationSubmit}>
              <h2>User Registration</h2>
              <div className="form-group">
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <input type="text" name="mobile" placeholder="Mobile Number" value={formData.mobileNo} onChange={handleChange} required />
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
                
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <input type="password" name="password" placeholder="Set Password" value={formData.password} onChange={handleChange} required />
              </div>
              
              <button type="submit">Register</button>
              <p onClick={toggleMode}>Already registered? Login here.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default UserLoginOffcanvas;
