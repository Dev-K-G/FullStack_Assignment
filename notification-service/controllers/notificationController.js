const nodemailer = require("nodemailer");
require("dotenv").config();

const fromuser=process.env.email_user;
const frompass=process.env.email_pass;
const subject = "Confirmation of Event Registration";
const message = "Your registration is confirmed!!"

console.log("Email User:", fromuser);
console.log("Email Pass:", frompass);

// SMTP Transport (Gmail + App Password)
const smtpClient = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.email_user,
    pass: process.env.email_pass,
  },
});

// Optional: verify connection
smtpClient.verify((err, success) => {
  if (err) console.log("SMTP ERROR:", err);
  else console.log("SMTP READY");
});

// Send Email Function
async function sendEmail(to) {
  try {
    const result = await smtpClient.sendMail({
      from: fromuser,
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
//   "receiver@example.com"
// );

// exports.sendNotification = async (req, res) => {
//     const { email, message } = req.body;

//     try {
//         await sendEmail(email);
//         res.status(200).json({ message: "Notification sent successfully" });
//     } catch (error) {
//         console.error("❌ Failed to send notification:", error.message);
//         res.status(500).json({ error: "Failed to send notification" });
//     }
// };
const sendNotification = async (to, message) => {
  return sendEmail(
    to
  );
};

module.exports = { sendNotification };