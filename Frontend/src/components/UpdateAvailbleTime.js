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
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('_id');
        const response = await fetch('http://localhost:27017/api/v1/patient/getConsultantsData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ "id": id })
        });
        console.log(response)
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setPreviousAvailability(data.consultants.availabilityTime);
          console.log(previousAvailability)
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
    e.preventDefault();
    const { name, value } = e.target;
    setNewAvailability({ ...newAvailability, [name]: value });
  };


  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('_id');
      console.log(newAvailability)
      const response = await fetch('http://localhost:27017/api/v1/consultant/updateAvailabilityTime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ availabilityTime:[ newAvailability] })
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
    <div className='container3'>

      
      <div>
        <h3>Your Availability</h3>
        <select  >
          <option value="">See Available Times</option>
          {previousAvailability.map((timeSlot) => {
            // Extracting hours from the time slot
            const startTimeHours = parseInt(timeSlot.startTime.split(':')[0], 10);
            const endTimeHours = parseInt(timeSlot.endTime.split(':')[0], 10);

            // Determining AM or PM based on hours
            const startPeriod = startTimeHours < 12 ? 'AM' : 'PM';
            const endPeriod = endTimeHours < 12 ? 'AM' : 'PM';

            return (
              <option key={timeSlot._id} value={`${timeSlot.day}: ${timeSlot.startTime} - ${timeSlot.endTime}`}>
                {`${timeSlot.day}: ${timeSlot.startTime} ${startPeriod} - ${timeSlot.endTime} ${endPeriod}`}
              </option>
            );
          })}
        </select>
      </div>
      <div>
      <h2>Add Availability Time</h2>
        <label>Day:</label>
        <select name="day" value={newAvailability.day} onChange={handleChange}>
          <option value="All Day">Select Day</option>
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
      <button onClick={handleConfirm}>Confirm</button>
    </div>
  );
};

export default UpdateAvailableTime;
