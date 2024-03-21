import React, { useState } from 'react';


const UserLoginOffcanvas = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    bloodGroup: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log(formData);
  };

  return (
    <div className="offcanvas-container">
      <div className="offcanvas">
        <button className="close-btn" onClick={onClose}>X</button> {/* Close button */}
        <form onSubmit={handleSubmit}>
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
        </form>
      </div>
    </div>
  );
};

export default UserLoginOffcanvas;
