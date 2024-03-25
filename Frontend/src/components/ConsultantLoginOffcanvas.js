import React, { useState } from 'react';
import DatePicker from 'react-datepicker';


const ConsultantLoginOffcanvas = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: {
      city: '',
      state: '',
      country: ''
    },
    gender: '',
    specification: '',
    mobileNo: '',
    password: '',
    photo: '',
    availabilityTime: [{ day: '', startTime: new Date(), endTime: new Date() }]
  });

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

  const handleTimeChange = (index, field, value) => {
    const tempAvailabilityTime = [...formData.availabilityTime];
    tempAvailabilityTime[index][field] = value;
    setFormData({ ...formData, availabilityTime: tempAvailabilityTime });
  };

  const addAvailabilitySlot = () => {
    setFormData({
      ...formData,
      availabilityTime: [
        ...formData.availabilityTime,
        { day: '', startTime: new Date(), endTime: new Date() }
      ]
    });
  };

  const removeAvailabilitySlot = (index) => {
    const tempAvailabilityTime = [...formData.availabilityTime];
    tempAvailabilityTime.splice(index, 1);
    setFormData({ ...formData, availabilityTime: tempAvailabilityTime });
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    // handle form submission
  };

  return (
    <div>
      <form onSubmit={handleRegistrationSubmit}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="address.city"
            placeholder="City"
            value={formData.address.city}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="address.state"
            placeholder="State"
            value={formData.address.state}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="address.country"
            placeholder="Country"
            value={formData.address.country}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="gender"
            placeholder="Gender"
            value={formData.gender}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="specification"
            placeholder="Specification"
            value={formData.specification}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="mobileNo"
            placeholder="Mobile Number"
            value={formData.mobileNo}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="photo"
            placeholder="Photo URL"
            value={formData.photo}
            onChange={handleChange}
            required
          />
        </div>
        {formData.availabilityTime.map((slot, index) => (
          <div key={index}>
            <input
              type="text"
              name={`availabilityTime[${index}].day`}
              placeholder="Day"
              value={slot.day}
              onChange={(e) => handleTimeChange(index, 'day', e.target.value)}
              required
            />
            <DatePicker
              selected={slot.startTime}
              onChange={(date) => handleTimeChange(index, 'startTime', date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              placeholderText="Start Time"
              required
            />
            <DatePicker
              selected={slot.endTime}
              onChange={(date) => handleTimeChange(index, 'endTime', date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              placeholderText="End Time"
              required
            />
            {index > 0 && (
              <button type="button" onClick={() => removeAvailabilitySlot(index)}>
                Remove Slot
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addAvailabilitySlot}>
          Add Availability Slot
        </button>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default ConsultantLoginOffcanvas;
