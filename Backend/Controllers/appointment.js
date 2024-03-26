const jwt = require('jsonwebtoken');
const Appointment = require('../models/appointment');
const Consultant = require('../models/consultant');
const Patient = require('../models/patient');
const moment = require('moment');

exports.createAppointment = async (req, res) => {
    try {
        const { date, time, consultantId } = req.body;

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

            // Convert provided date and time to a moment object
            const requestedDateTime = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');

            // Calculate the end time based on the duration (assuming duration is in minutes)
            const startTime = moment(requestedDateTime);
            const endTime = moment(requestedDateTime).add(30, 'minutes');

            // console.log("Existing timing...");
            // console.log(startTime);
            // console.log(endTime);

            // Fetch existing appointments for the consultant
            const existingAppointments = await Appointment.find({
                consultant: consultantId,
                date: date,
            });

            // Check for overlapping appointments
            const overlappingAppointment = existingAppointments.some(appointment => {
    
                const datetime = moment(`${appointment.date} ${appointment.time}`, 'YYYY-MM-DD HH:mm');

                const existingStartTime = moment(datetime);

                const existingEndTime = moment(datetime).add(30, 'minutes');

                // console.log("---------");
                // console.log(existingStartTime);
                // console.log(existingEndTime);
                // console.log("End",(endTime.isAfter(existingStartTime)));
                // console.log("s", endTime.isSameOrBefore(existingEndTime));
                // console.log("Strat",(startTime.isSameOrAfter(existingStartTime)));
                // console.log("s", startTime.isBefore(existingEndTime));
                
                // Check if the new appointment overlaps with any existing appointments
                return (
                    ( (endTime.isAfter(existingStartTime) && endTime.isSameOrBefore(existingEndTime)) ) ||
                    ( (startTime.isSameOrAfter(existingStartTime) && startTime.isBefore(existingEndTime)) )
                );               
            });

            if (overlappingAppointment) {
                return res.status(400).json({
                    success: false,
                    message: 'Conflicting appointment time',
                });
            }

            // Fetch consultant details
            const consultant = await Consultant.findById(consultantId);
            if (!consultant) {
                return res.status(404).json({
                    success: false,
                    message: 'Consultant not found',
                });
            }

            // Use the charge field of the consultant to determine the fee
            const fee = consultant.charge;

            // Create appointment
            const appointment = new Appointment({
                date: date,
                time: time,
                fee,
                patient: patientId,
                consultant: consultantId
            });

            await appointment.save();

            await Patient.findByIdAndUpdate(
                patientId,
                { $push: { appointments: appointment._id } },
                { new: true }
            );

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

exports.getallAppointmentsForPatient = async (req, res) => {
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

            const patientId = decoded.userId;

            // Query appointments for the consultant
            const appointments = await Appointment.find({ patient: patientId });

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



exports.getScheduledAppointmentsForConsultant = async (req, res) => {
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
            const appointments = await Appointment.find({ consultant: consultantId, isConfirmedByConsultant: true });

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

exports.acceptAppointmentRequest = async (req, res) => {
    try {
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
            const { appointmentId } = req.body;
    
            const appointment = await Appointment.findById(appointmentId);
            if (!appointment) {
                return res.status(404).json({
                    success: false,
                    message: 'Appointment not found',
                });
            }

            // Check if the appointment belongs to the consultant
            if (appointment.consultant.toString() !== consultantId) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized access to appointment',
                });
            }

            // Accept appointment
            appointment.status = 'scheduled';
            appointment.isConfirmedByConsultant = true;

            // Save the updated appointment
            await appointment.save();

            // Push appointment ID to consultant's profile
            const consultant = await Consultant.findById(consultantId);
            if (!consultant) {
                return res.status(404).json({
                    success: false,
                    message: 'Consultant not found',
                });
            }
            consultant.appointments.push(appointmentId);
            await consultant.save();

            return res.status(200).json({
                success: true,
                message: 'Appointment accepted successfully',
                appointment,
            });
        });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Error accepting appointment',
            });
        }
};

exports.rejectAppointmentRequest = async (req, res) => {
    try {
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
            const { appointmentId } = req.body;
            

            // Find the appointment
            const appointment = await Appointment.findById(appointmentId);
            if (!appointment) {
                return res.status(404).json({
                    success: false,
                    message: 'Appointment not found',
                });
            }

            // Check if the appointment belongs to the consultant
            if (appointment.consultant.toString() !== consultantId) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized access to appointment',
                });
            }

            // Reject appointment
            appointment.status = 'cancelled';

            // Save the updated appointment
            await appointment.save();

            return res.status(200).json({
                success: true,
                message: 'Appointment rejected successfully',
                appointment,
            });
        });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Error rejecting appointment',
            });
        }
};