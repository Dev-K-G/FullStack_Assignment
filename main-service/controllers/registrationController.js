const Registration = require("../models/Registration.js");
const { sendNotification } = require("../../notification-service/controllers/notificationController.js");

exports.registerUser = async (req, res) => {
  try {
    console.log("Received registration request:", req.body);
    const { name, email, event, notify} = req.body || {};

    const registration = await Registration.create({
      name:name.trim(), // sanitize name
      email:email.trim().toLowerCase(), // normalize email
      event,
      notify
    });

    await sendNotification(    
        email,                                  // to     
        `Hi ${name.trim()}, you are registered for ${event}` // message
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