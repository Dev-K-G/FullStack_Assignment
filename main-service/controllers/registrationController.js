const Registration = require("../models/Registration.js");
const { sendNotification } = require('../../notification-service/controllers/notificationController.js')

exports.registerUser = async (req, res) => {
  try {
    console.log("Received registration request:", req.body);
    const { name, email, event } = req.body || {};

    const registration = await Registration.create({
      name,
      email,
      event,
    });

    await sendNotification(    
        email,                                  // to     
        `Hi ${name}, you are registered for ${event}` // message
    );

    res.json({
      success: true,
      data: registration,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Registration failed" });
  }
};