const nodemailer = require("nodemailer");
require("dotenv").config();

// Transporter (Gmail SMTP)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendNotification = async (req, res) => {
  try {
    const { email, message } = req.body;

    const mailOptions = {
      from: `"Event System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Event Registration Confirmation",
      html: `<p>${message}</p>`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "Email sent" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Email failed" });
  }
};