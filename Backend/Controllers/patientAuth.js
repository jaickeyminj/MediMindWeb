const bcrypt = require("bcrypt");
const Patient = require("../models/patient");
const { generateToken } = require("../utils/authUtils");

exports.patientSignup = async (req, res) => {
    try {
        const { name, bloodGroup, email, gender, dob, address, mobileNo, password } = req.body;

        const existingPatient = await Patient.findOne({ email });

        if (existingPatient) {
            return res.status(400).json({
                success: false,
                message: 'Patient already exists',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const patient = await Patient.create({
            name,
            bloodGroup,
            email,
            gender,
            dob,
            address,
            mobileNo,
            password: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: 'Patient created successfully',
            patient,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Patient cannot be registered, please try again later',
        });
    }
};


exports.patientLogin = async (req, res) => {
    try {

        const { email, password } = req.body;

        const patient = await Patient.findOne({ email });

        if (!patient) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials, Patient does not exist',
            });
        }

        const isPasswordValid = await bcrypt.compare(password, patient.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials, Email and Password do not match',
            });
        }

        const token = generateToken(patient, 'Patient');

        return res.status(200).json({
            success: true,
            message: 'Patient logged in successfully',
            patient,
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Login failed, please try again later',
        });
    }
};

exports.updatePatientData = async (req, res) => {
    try {
        const { patientId, updates } = req.body;
        console.log(updates);
        const updatedPatient = await Patient.findByIdAndUpdate(
            patientId,
            { $set: updates }, // Using $set to update only specified fields
            { new: true }
        );

        if (!updatedPatient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Patient data updated successfully',
            patient: updatedPatient,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error updating patient data',
        });
    }
};


