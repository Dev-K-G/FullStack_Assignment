const Registration = require("../models/Registration.js");
const { sendEmail } = require("../services/notificationClient.js");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, event } = req.body;

    const registration = await Registration.create({
      name,
      email,
      event,
    });

    await sendEmail(
      email,
      `Hi ${name}, you are registered for ${event}`
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