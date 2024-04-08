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

    const handlePayment = async (appointmentId, amount) => {
        try {
            console.log(appointmentId)
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:27017/api/v1/patient/razorpay/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ "appointmentId": appointmentId, "amount": amount })
            });
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
            if (response.ok) {
                const order = await response.json();
                console.log(order)
                const options = {
                    key: 'rzp_test_Au3bh7uy56GXOh', // Replace with your Razorpay key
                    amount: (order.amount)*100,
                    currency: order.currency,
                    name: 'Medi Mind',
                    description: "Doctor's Appointment",
                    image: "https://cdn5.vectorstock.com/i/1000x1000/58/79/healthcare-hospital-logo-clinic-doctor-vector-29695879.jpg",
                    order_id: order.id,
                    handler: async (response)=> {
                        console.log(response);
                        alert(response.razorpay_order_id);
                        const meetingLinkResponse = await fetch('http://localhost:27017/api/v1//patient/createMeetLink', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ "appointmentId": appointmentId })
                        });

                        if (meetingLinkResponse.ok) {
                            const meetingLinkData = await meetingLinkResponse.json();
                            console.log('Meeting Link:', meetingLinkData.link);
                            // Update the appointment status with the meeting link
                            setAppointments(prevAppointments => {
                                return prevAppointments.map(appointment => {
                                    if (appointment._id === appointmentId) {
                                        return {
                                            ...appointment,
                                            meetingLink: meetingLinkData.link
                                        };
                                    }
                                    return appointment;
                                });
                            });
                        } else {
                            console.error('Error fetching meeting link:', meetingLinkResponse.statusText);
                        }
                    },
                    prefill: {
                        name: "Saurabh Singh", // your customer's name
                        email: "saurabh.kumar@example.com",
                        contact: "9000091234" // Provide the customer's phone number for better conversion rates
                    },
                    notes: {
                        address: "Razorpay Corporate Office"
                    },
                };
                const rzp1 = new window.Razorpay(options);
                rzp1.open();
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
                                <th>Meeting Link</th>
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
                                            <button onClick={() => handlePayment(appointment._id, appointment.fee)}>Pay Fee</button>
                                        )}
                                    </td>
                                    <td>{appointment.meetingLink || '-'}</td>
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
