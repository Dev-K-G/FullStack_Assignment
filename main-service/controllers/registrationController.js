const Registration = require("../models/Registration.js");
const subscribers = require("../models/Subscribers.js");
const { sendNotification } = require("../../notification-service/controllers/notificationController.js");

exports.registerUser = async (req, res) => {
  try {
    console.log("Received registration request:", req.body);
    const { eventId, name, email, event, notify} = req.body || {};

    const registration = await Registration.create({
      eventId: parent(eventId),
      name:name.trim(), // sanitize name
      email:email.trim().toLowerCase(), // normalize email
      event,
      notify
    });

    if (notify===true) {
      try {
        const users = await subscribers.create({ 
          name: name.trim(),
          email: email.trim().toLowerCase() 
        });
      } catch (err) {
        console.error("Subscriber creation error (may already exist):", err.message);
      }
    };

    await sendNotification(    
        email,                                  // to     
        'Event Registration Confirmation',       // subject
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