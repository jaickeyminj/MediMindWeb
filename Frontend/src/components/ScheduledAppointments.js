import React, { useState, useEffect } from 'react';

const ScheduledAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Fetch appointments data from the API
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://medimind.in.net:27017/api/v1/consultant/getScheduledAppointmentsForConsultant', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setAppointments(data.appointments);
        } else {
          console.error('Failed to fetch appointments:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div>
      <h2>Scheduled Appointments</h2>
     <div className='container2'>

      <ul>
        {appointments.map(appointment => (
          <li key={appointment._id} className="appointment-card">
            <div>Date: {appointment.date}</div>
            <div>Time: {appointment.time}</div>
            <div>Status: {appointment.status}</div>
            <div>Fee: {appointment.fee}</div>
            <div>Duration: {appointment.duration} mins</div>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
};

export default ScheduledAppointments;
