const Razorpay = require('razorpay'); 
const { v4: uuid } = require("uuid");
require("dotenv").config();
// This razorpayInstance will be used to 
// access any resource from razorpay 
const razorpay = new Razorpay({ 
  
    // Replace with your key_id 
    key_id: process.env.RAZORPAY_KEY_ID, 
  
    // Replace with your key_secret 
    key_secret: process.env.RAZORPAY_KEY_SECRET 
  }); 

exports.createRazorpayOrder = (req, res) => {
  console.log("create order");
    const options = {
        amount: req.body.amount, // amount in the smallest currency unit
        currency: 'INR',
        receipt: "receipt_order_",
        payment_capture: 1
    };
    razorpay.orders.create(options, (err, order) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
        console.log(order);
        res.json(order);
    });
};