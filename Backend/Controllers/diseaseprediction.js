
const jwt = require('jsonwebtoken');

const Patient = require("../Models/patient");

exports.addPredictedDisease = async (req, res) => {
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

        const { predictedDisease } = req.body;
        const patientId =  decoded.userId;

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }
        
        patient.diseases.push({ predictedDisease });
        await patient.save();

        return res.status(201).json({
            success: true,
            message: 'Predicted disease added successfully',
            predictedDisease,
        });
    });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error adding predicted disease',
        });
    }
};

exports.updatePredictionStatus = async (req, res) => {
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

        const { predictedDisease, isCorrect } = req.body;
        const patientId = decoded.userId;

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }

        const diseaseToUpdate = patient.diseases.find(disease => disease.predictedDisease === predictedDisease);
        if (!diseaseToUpdate) {
            return res.status(404).json({
                success: false,
                message: 'Predicted disease not found for the patient',
            });
        }
        
        diseaseToUpdate.isCorrect = isCorrect;
        await patient.save();

        return res.status(200).json({
            success: true,
            message: 'Prediction status updated successfully',
            predictedDisease,
            isCorrect,
        });
    });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error updating prediction status',
        });
    }
};

exports.getPredictedDiseases = async (req, res) => {
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

        const patientId = decoded.userId;

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }

        const predictedDiseases = patient.diseases.map(disease => ({
            predictedDisease: disease.predictedDisease,
            isCorrect: disease.isCorrect
        }));

        return res.status(200).json({
            success: true,
            message: 'Predicted diseases fetched successfully',
            predictedDiseases,
        });
    });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching predicted diseases',
        });
    }
};