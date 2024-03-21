import React, { useState } from 'react';

const UserLoginOffcanvas = ({ onClose }) => {
  const [loginMode, setLoginMode] = useState(true); // State to toggle between login and registration mode
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    mobile: '',
    bloodGroup: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Add your login submission logic here
    console.log('Login:', formData.email, formData.password);
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    // Add your registration submission logic here
    console.log('Registration:', formData);
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
              <p>Not registered yet?</p><p onClick={toggleMode}> Register here.</p>
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
                <input type="text" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <input type="text" name="bloodGroup" placeholder="Blood Group" value={formData.bloodGroup} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
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
