const bcrypt = require("bcrypt");
const Consultant = require("../models/consultant"); 
const { generateToken } = require("../utils/authUtils");


exports.consultantSignup = async (req, res) => {
    try {
        const { name, email, address, gender, specification, mobileNo, password } = req.body;

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
            password: hashedPassword
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
