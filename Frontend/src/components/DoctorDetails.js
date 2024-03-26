import React, { useState, useEffect } from 'react';

const DoctorDetails = ({ doctorId }) => {
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:27017/api/v1/patient/getConsultantsData`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ "id": doctorId})
        });

        if (response.ok) {
          const data = await response.json();
          setDoctorDetails(data);
          console.log(data)
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

  return (
    <div className="doctor-details">
      {isLoading && <div>Loading...</div>}
      {!isLoading && doctorDetails && (
        <>
          <h2>Doctor Details</h2>
          <p>Name: {doctorDetails.name}</p>
          <p>Email: {doctorDetails.email}</p>
          <p>Gender: {doctorDetails.gender}</p>
          <p>Specialization: {doctorDetails.specification}</p>
          <p>Charge: ${doctorDetails.charge}</p>
          {/* Add more details as needed */}
        </>
      )}
    </div>
  );
};

export default DoctorDetails;
