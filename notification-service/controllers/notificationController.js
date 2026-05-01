const nodemailer = require("nodemailer");

// SMTP Transport (Gmail + App Password)
const smtpClient = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // TLS
  secure: false, // MUST be false for port 587
  auth: {
    user: "kasturi.intelegencia@gmail.com",          // replace with your email
    pass: "",    // Gmail App Password (no spaces)
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
async function sendEmail(to, subject, message) {
  try {
    const result = await smtpClient.sendMail({
      from: '"Event System" <yourgmail@gmail.com>',
      to:"KasturiM.Sathe@yahoo.com",
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
  "receiver@example.com",
  "Test Email",
  "Hello! This is a test email from Node.js SMTP with Gmail App Password. Your Event Is Registered!!!!!"
);

exports.sendNotification = async (req, res) => {
    const { email, message } = req.body;

    try {
        await sendEmail(email, "Notification", message);
        res.status(200).json({ message: "Notification sent successfully" });
    } catch (error) {
        console.error("❌ Failed to send notification:", error.message);
        res.status(500).json({ error: "Failed to send notification" });
    }
};