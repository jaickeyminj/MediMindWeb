const Razorpay = require('razorpay'); 
require("dotenv").config();
// This razorpayInstance will be used to 
// access any resource from razorpay 
const razorpayInstance = new Razorpay({ 
  
    // Replace with your key_id 
    key_id: process.env.RAZORPAY_KEY_ID, 
  
    // Replace with your key_secret 
    key_secret: process.env.RAZORPAY_KEY_SECRET 
  }); 

module.exports = razorpayInstance;