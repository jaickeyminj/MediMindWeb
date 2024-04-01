const Patient = require("../Models/patient");

exports.addFeedback = async (req, res) => {
    try {
        const { consultantId, text } = req.body;
        const patientId = req.user.id; 

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }

        const consultantIndex = patient.appointments.findIndex(appointment => appointment.consultant.toString() === consultantId);
        if (consultantIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Consultant not found in patient appointments',
            });
        }

        patient.feedback.push({ consultant: consultantId, text });
        await patient.save();

        return res.status(201).json({
            success: true,
            message: 'Feedback added successfully',
            feedback: { consultant: consultantId, text },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error adding feedback',
        });
    }
};
