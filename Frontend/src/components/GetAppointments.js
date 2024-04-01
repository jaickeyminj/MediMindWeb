import React, { useState, useEffect } from 'react';

const GetAppointments = () => {
    const [appointments, setAppointments] = useState([]);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // Handle case when token is not available
                return;
            }

            const response = await fetch('http://localhost:27017/api/v1/consultant/getRequestedAppointmentList', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setAppointments(data.appointments);
                console.log(data)
            } else {
                const errorData = await response.json();
                alert('Failed to fetch appointments: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            alert('Failed to fetch appointments. Please try again later.');
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleAccept = async (appointmentId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // Handle case when token is not available
                return;
            }

            const response = await fetch('http://localhost:27017/api/v1/consultant/acceptAppointmentRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ appointmentId })
            });
            if (response.ok) {
                alert('Appointment request accepted successfully!');
                // Refresh appointments after accepting
                fetchAppointments();
            } else {
                const errorData = await response.json();
                alert('Failed to accept appointment request: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error accepting appointment request:', error);
            alert('Failed to accept appointment request. Please try again later.');
        }
    };

    const handleReject = async (appointmentId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // Handle case when token is not available
                return;
            }

            const response = await fetch('http://localhost:27017/api/v1/consultant/rejectAppointmentRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ appointmentId })
            });
            if (response.ok) {
                alert('Appointment request rejected successfully!');
                // Refresh appointments after rejecting
                fetchAppointments();
            } else {
                const errorData = await response.json();
                alert('Failed to reject appointment request: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error rejecting appointment request:', error);
            alert('Failed to reject appointment request. Please try again later.');
        }
    };

    return (
        <div>
            <h2>Appointment Requests</h2>
            <ul className='container2'>
                {appointments.map(appointment => (
                    appointment.status === 'waiting' && (
                        <li key={appointment._id} className="appointment-card">
                            <div>Date: {appointment.date}</div>
                            <div>Time: {appointment.time}</div>
                            <div>Status: {appointment.status}</div>
                            <button onClick={() => handleAccept(appointment._id)}>Accept</button>
                            <button onClick={() => handleReject(appointment._id)}>Reject</button>
                        </li>
                    )
                ))}
            </ul>


        </div>
    );
};

export default GetAppointments;
