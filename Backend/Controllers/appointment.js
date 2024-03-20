const jwt = require('jsonwebtoken');
const Appointment = require('../models/appointment');

exports.createAppointment = async (req, res) => {
    try {
        const { date, time, fee, consultantId, duration } = req.body;
        
        // Verify token
        const authorizationHeader = req.headers['authorization'];
        const token = authorizationHeader ? authorizationHeader.substring('Bearer '.length) : null;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token not provided',
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token',
                });
            }

            const patientId = decoded.userId;

            const appointment = new Appointment({
                date,
                time,
                fee,
                patient: patientId,
                consultant: consultantId,
                duration,        
            });

            await appointment.save();

            return res.status(201).json({
                success: true,
                message: 'Appointment created successfully',
                appointment
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error creating appointment'
        });
    }
};

exports.getAllAppointmentsForConsultant = async (req, res) => {
    try {
        // Verify token and extract consultant ID
        const authorizationHeader = req.headers['authorization'];
        const token = authorizationHeader ? authorizationHeader.substring('Bearer '.length) : null;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token not provided',
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token',
                });
            }

            const consultantId = decoded.userId;

            // Query appointments for the consultant
            const appointments = await Appointment.find({ consultant: consultantId });

            return res.status(200).json({
                success: true,
                message: 'Appointments found successfully',
                appointments,
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching appointments',
        });
    }
};



exports.getRequestedAppointmentList = async (req, res) => {
    try {
        // Verify token and extract consultant ID
        const authorizationHeader = req.headers['authorization'];
        const token = authorizationHeader ? authorizationHeader.substring('Bearer '.length) : null;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token not provided',
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token',
                });
            }

            const consultantId = decoded.userId;

            // Query unapproved appointments for the consultant
            const unapprovedAppointments = await Appointment.find({ consultant: consultantId, isConfirmedByConsultant: false });

            return res.status(200).json({
                success: true,
                message: 'Unapproved appointments found successfully',
                appointments: unapprovedAppointments,
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching unapproved appointments',
        });
    }
};
