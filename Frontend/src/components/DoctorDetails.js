import React, { useState, useEffect } from 'react';

const DoctorDetails = ({ doctorId }) => {
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:27017/api/v1/patient/getConsultantsData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ "id": doctorId })
        });

        if (response.ok) {
          const data = await response.json();
          setDoctorDetails(data);
        } else {
          console.error('Error fetching doctor details:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching doctor details:', error);
      }
      setIsLoading(false);
    };

    fetchDoctorDetails();
  }, [doctorId]);

  const handleBookAppointment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:27017/api/v1/patient/RequestAppointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ date: '2024-04-15', time: '10:00', consultantId: '65fac4e85c65469fef15e208' })
      });

      if (response.ok) {
        console.log('Appointment requested successfully!');
        // Handle success response
      } else {
        console.error('Error requesting appointment:', response.statusText);
        // Handle error response
      }
    } catch (error) {
      console.error('Error requesting appointment:', error);
      // Handle error
    }
  };

  return (
    <div className="doctor-details">
      {isLoading && <div>Loading...</div>}
      {!isLoading && doctorDetails && (
        <>
          <h2>Doctor Details</h2>
          <p>Name: {doctorDetails.consultants.name}</p>
          <p>Email: {doctorDetails.consultants.email}</p>
          <p>Gender: {doctorDetails.consultants.gender}</p>
          <p>Specialization: {doctorDetails.consultants.specification}</p>
          <p>Charge: Rs.{doctorDetails.consultants.charge}</p>
          <h3>Available Times:</h3>
          <ul>
            {doctorDetails.consultants.availabilityTime.map((timeSlot) => (
              <li key={timeSlot._id}>
                {timeSlot.day}: {timeSlot.startTime} - {timeSlot.endTime}
                <button onClick={handleBookAppointment()}>Request Appointment</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default DoctorDetails;
