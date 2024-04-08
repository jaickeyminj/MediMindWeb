const jwt = require('jsonwebtoken');
const cloudinary = require('../Config/cloudinary');
const Patient = require("../Models/patient");

exports.storeReportLink = async (req, res) => {
    try {
        // Verify token and extract patient ID
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

            const reportDetails = [];

            for (let i = 0; i < req.files.length; i++) {
                const localFilePath = req.files[i].path;
                const result = await cloudinary.uploader.upload(localFilePath);
                const imageUrl = result.url;
                //const description = req.files[i].fd; 
                
                reportDetails.push({ report: imageUrl });
            }

            const patient = await Patient.findById(patientId);
            if (!patient) {
                return res.status(404).json({
                    success: false,
                    message: 'Patient not found',
                });
            }

            patient.reports.push(...reportDetails);
            await patient.save();

            return res.status(200).json({
                success: true,
                message: 'Report links stored and updated successfully',
                reportDetails,
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error storing and updating report links',
        });
    }
};

exports.getAllReportIds = async (req, res) => {
    try {
        // Verify token and extract patient ID
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

            const reportLinks = patient.reports.map(report => report.report);

            return res.status(200).json({
                success: true,
                message: 'Report links retrieved successfully',
                reportLinks,
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving report links',
        });
    }
};