// authUtils.js
const jwt = require('jsonwebtoken');
require("dotenv").config();

// Secret key for signing the token
const secretKey = process.env.JWT_SECRET; 


// Generate a token for a user
const generateToken = (user, user_role) => {
    // Payload: Data you want to include in the token
    const payload = {
        userId: user._id, 
        email: user.contactMail,
        role: user_role
    };

    // Options for the token
    const options = {
        expiresIn: '2h',
    };

    // Sign the token
    const token = jwt.sign(payload, secretKey, options);

    return token;
};

module.exports = { generateToken };
