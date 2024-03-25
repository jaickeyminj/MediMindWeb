const Consultant = require("../models/consultant");
const jwt = require('jsonwebtoken');

exports.searchConsultantBySpecialty = async (req, res) => {
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

        const { specification } = req.body;

        const consultants = await Consultant.find({ specification: specification });

        return res.status(200).json({
            success: true,
            message: 'Consultants found successfully',
            consultants,
        });
    });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error occurred while searching for consultants',
        });
    }
};

exports.getAllConsultants = async (req, res) => {
    try {
        const consultants = await Consultant.find();
        return res.status(200).json({
            success: true,
            message: 'Consultants retrieved successfully',
            consultants,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error occurred while retrieving consultants',
        });
    }
};

exports.getConsultantsData = async (req, res) => {
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


        const { id } = req.body;


        console.log(id);
        const consultants = await Consultant.findById(id);
        console.log(consultants);
        return res.status(200).json({
            success: true,
            message: 'Consultants found successfully',
            consultants,
        });
    });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error occurred while searching for consultants',
        });
    }
};