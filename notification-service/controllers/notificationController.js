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
      from: from,
      to: to,
      subject: subject,
      text: message, // fallback text
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">          
          <p>Hello,</p>
          <p>Thank you for registering for our event.</p>
          <p><strong>${message}</strong></p>

          <h3>Event Details:</h3>
          <ul>
            <li>Status: Confirmed</li>
            <li>Date: Upcoming</li>
          </ul>

          <p>If you have any questions, feel free to reply to this email.</p>

          <br/>
          <p>Best Regards,<br/>Event Team</p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully:", result.messageId);
    return result;
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    throw err;
  }
}

// Example usage
// sendEmail(
//   "from@example.com",
//   "receiver@example.com",
//   "Confirmation Of Event Registration",
//   "Conformation of Event Registration"
// );

exports.sendNotification = async (req, res) => {
    const { email, message } = req.body;

    try {
        await sendEmail(fromuser, email, "Confirmation Of Event Registration", message);
        res.status(200).json({ message: "Notification sent successfully" });
    } catch (error) {
        console.error("❌ Failed to send notification:", error.message);
        res.status(500).json({ error: "Failed to send notification" });
    }
};