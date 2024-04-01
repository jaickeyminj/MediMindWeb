const bcrypt = require("bcrypt");
const Consultant = require("../models/consultant"); 
const jwt = require('jsonwebtoken');
const { generateToken } = require("../utils/authUtils");


exports.consultantSignup = async (req, res) => {
    try {
        const { name, email, address, gender, specification, mobileNo, password, charge} = req.body;

        const existingConsultant = await Consultant.findOne({ email });
        if (existingConsultant) {
            return res.status(400).json({
                success: false,
                message: 'Consultant already exists',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const consultant = await Consultant.create({
            name,
            email,
            address,
            gender,
            specification,
            mobileNo,
            password: hashedPassword,
            charge
        });

        return res.status(201).json({
            success: true,
            message: 'Consultant created successfully',
            consultant,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Consultant registration failed, please try again later',
        });
    }
};

exports.consultantLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const consultant = await Consultant.findOne({ email });
        if (!consultant) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials, Consultant does not exist',
            });
        }

        const isPasswordValid = await bcrypt.compare(password, consultant.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials, Email and Password do not match',
            });
        }

        const token = generateToken(consultant, 'Consultant');

        return res.status(200).json({
            success: true,
            message: 'Consultant logged in successfully',
            consultant,
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

exports.updateAvailabilityTime = async (req, res) => {
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

            const { availabilityTime } = req.body;
            

            // Find the consultant by ID
            const consultant = await Consultant.findById(consultantId);
            if (!consultant) {
                return res.status(404).json({
                    success: false,
                    message: 'Consultant not found',
                });
            }

            // Update the availability time
            consultant.availabilityTime = availabilityTime;

            // Save the updated consultant
            await consultant.save();

            return res.status(200).json({
                success: true,
                message: 'Availability time updated successfully',
                consultant
            });
        });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Error updating availability time'
            });
        }
};

exports.validateTokenConsultant = async (req, res) => {
    try {
        const authorizationHeader = req.headers['authorization'];
        const token = authorizationHeader ? authorizationHeader.substring('Bearer '.length) : null;
      
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token not provided for Consultant',
            });
        }
      
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token for Consultant',
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Validated Consultant token successfully',
            });
        }); 
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};