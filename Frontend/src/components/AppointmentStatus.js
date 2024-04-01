import React, { useState, useEffect } from 'react';

const AppointmentStatus = () => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:27017/api/v1/patient/getallAppointmentsForPatient', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setAppointments(data.appointments);
                } else {
                    console.error('Error fetching appointments:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
            setIsLoading(false);
        };

        fetchAppointments();
    }, []);

    const handlePayment = async (appointmentId,amount) => {
        try {
            console.log(appointmentId)
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:27017/api/v1/patient/razorpay/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ "appointmentId":appointmentId,"amount":amount })
            });

            if (response.ok) {
                console.log('Payment request sent successfully!');
                // Handle response or update state as needed
            } else {
                console.error('Error sending payment request:', response.statusText);
            }
        } catch (error) {
            console.error('Error sending payment request:', error);
        }
    };

    return (
        <div className="appointment-status">
            <h2>Appointment Status</h2>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                appointments.length === 0 ? (
                    <div>No appointments found.</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Appointment Id</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Fee</th>
                                <th>Payment Status</th>
                                <th>Confirmation Status</th>
                                <th>Payment Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(appointment => (
                                <tr key={appointment._id}>
                                    <td>{appointment._id}</td>
                                    <td>{appointment.date}</td>
                                    <td>{appointment.time}</td>
                                    <td>{appointment.fee}</td>
                                    <td>{appointment.isPaid ? 'Paid' : 'Pending'}</td>
                                    <td>{appointment.isConfirmedByConsultant ? 'Confirmed' : 'Pending'}</td>
                                    <td>
                                        {appointment.isConfirmedByConsultant && !appointment.isPaid && (
                                            <button onClick={() => handlePayment(appointment._id,appointment.fee)}>Pay Fee</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            )}
        </div>
    );
};

export default AppointmentStatus;
