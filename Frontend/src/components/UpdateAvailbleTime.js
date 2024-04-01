import React, { useState, useEffect } from 'react';

const UpdateAvailableTime = ({ token }) => {
  const [availability, setAvailability] = useState([]);
  const [newAvailability, setNewAvailability] = useState({
    day: '',
    startTime: '',
    endTime: ''
  });
  const [previousAvailability, setPreviousAvailability] = useState([]);

  useEffect(() => {
    const fetchPreviousAvailability = async () => {
      try {
        const response = await fetch('http://3.111.21.73:27017/api/v1/patient/getConsultantsData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ id: "65fac4e85c65469fef15e208" })
        });
        if (response.ok) {
          const data = await response.json();
          setPreviousAvailability(data.availabilityTime);
        } else {
          const errorData = await response.json();
          alert('Failed to fetch previous availability time: ' + errorData.message);
        }
      } catch (error) {
        console.error('Error fetching previous availability time:', error);
        alert('Failed to fetch previous availability time. Please try again later.');
      }
    };

    fetchPreviousAvailability();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAvailability({ ...newAvailability, [name]: value });
  };

  const handleAddAvailability = () => {
    setAvailability([...availability, newAvailability]);
    setNewAvailability({
      day: '',
      startTime: '',
      endTime: ''
    });
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch('http://3.111.21.73:27017/api/v1/consultant/updateAvailabilityTime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ availabilityTime: availability })
      });
      if (response.ok) {
        alert('Availability time updated successfully!');
      } else {
        const errorData = await response.json();
        alert('Failed to update availability time: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error updating availability time:', error);
      alert('Failed to update availability time. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Add Availability Time</h2>
      <h3>Previous Availability</h3>
      <ul>
        {previousAvailability.map((item, index) => (
          <li key={index}>{item.day} - {item.startTime} to {item.endTime}</li>
        ))}
      </ul>
      <div>
        <label>Day:</label>
        <select name="day" value={newAvailability.day} onChange={handleChange}>
          <option value="">Select Day</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>
      </div>
      <div>
        <label>Start Time:</label>
        <input type="time" name="startTime" value={newAvailability.startTime} onChange={handleChange} />
      </div>
      <div>
        <label>End Time:</label>
        <input type="time" name="endTime" value={newAvailability.endTime} onChange={handleChange} />
      </div>
      <button onClick={handleAddAvailability}>+ Add</button>
      <button onClick={handleConfirm}>Confirm</button>
    </div>
  );
};

export default UpdateAvailableTime;
