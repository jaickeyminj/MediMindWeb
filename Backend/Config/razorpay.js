const Razorpay = require('razorpay'); 
const Appointment = require('../Models/appointment');
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


  /*
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


*/
exports.createRazorpayOrder = (req, res) => {
    console.log("create order");
    const amount = req.body.amount; // Amount in the smallest currency unit
    const currency = 'INR';
    const receipt = "receipt_order_";

    const options = {
        amount: amount,
        currency: currency,
        receipt: receipt,
        payment_capture: 1
    };

    razorpay.orders.create(options, async (err, order) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
        console.log(order);
        res.json(order);

        try {
            // Update appointment status to 'paid' and set isPaid to true
            const appointmentId = req.body.appointmentId;
             // Assuming you're sending the appointmentId in the request body

             console.log(appointmentId);
            const appointment = await Appointment.findById(appointmentId);
            
            if (appointment) {
                appointment.isPaid = true;
                // Deduct the fee from the appointment object if necessary
                // appointment.fee -= deductedAmount;
                await appointment.save();
            }
            console.log("Appointment ...");
            console.log(appointment);
        } catch (error) {
            console.error("Error updating appointment status:", error);
        }
    });
};
