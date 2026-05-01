const nodemailer = require("nodemailer");
require("dotenv").config();

const fromuser=process.env.email_user;
const frompass=process.env.email_pass;

console.log("Email User:", fromuser);
console.log("Email Pass:", frompass);

// SMTP Transport (Gmail + App Password)
const smtpClient = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_SERVER_PORT || 587, // TLS
  secure: false, // MUST be false for port 587
  auth: {
    user: fromuser,          // replace with your email
    pass: frompass,    // Gmail App Password (no spaces)
  },
  tls: {
    minVersion: "TLSv1.2",
  },
});

// Optional: verify connection
smtpClient.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP not ready:", error);
  } else {
    console.log("✅ SMTP server is ready to send emails");
  }
});

// Send Email Function
async function sendEmail(from, to, subject, message) {
  try {
    const result = await smtpClient.sendMail({
      from: from, //'"Event System" <yourgmail@gmail.com>',
      to: "receiver@yahoo.com",
      subject,
      text: message,
    });

    console.log("✅ Email sent successfully:", result.messageId);
    return result;
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    throw err;
  }
}

// Example usage
sendEmail(
  "from@example.com",
  "receiver@example.com",
  "Test Email",
  "Conformation of Event Registration"
);

exports.sendNotification = async (req, res) => {
    const { email, message } = req.body;

    try {
        await sendEmail(fromuser, email, "Notification", message);
        res.status(200).json({ message: "Notification sent successfully" });
    } catch (error) {
        console.error("❌ Failed to send notification:", error.message);
        res.status(500).json({ error: "Failed to send notification" });
    }
};