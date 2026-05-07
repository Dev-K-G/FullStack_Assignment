const ExcelJS = require("exceljs");


const Registration = require("../models/Registration.js");
const subscribers = require("../models/Subscribers.js");
const eventsModel = require("../models/Events.js");
const { sendNotification } = require("../../notification-service/controllers/notificationController.js");
const Registrations = require("../models/Registration.js");

exports.registerUser = async (req, res) => {
  try {
    console.log("Received registration request:", req.body);
    const { name, email, event, notify, eventId } = req.body || {};
    // const { eventId } = req.params.eventId || {};
    const userEmail =  String(req.body.email || "").trim().toLowerCase();
      //console.log("Sanitized email:", email);
    const registration = await Registration.create({      
      name:name.trim(), // sanitize name
      email:email.trim().toLowerCase(), // normalize email
      event,
      notify,
      eventId
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

process.nextTick(async () => {
      try {
        const event = await eventsModel.findOne({ eventId: eventId }); 
        const message = `<p>Hello ${name.trim()},</p><p>Thank you for registering for the event.</p>
          <h3>Event Details:</h3>
           <ul>
             <li>Title: ${event.title}</li>
             <li>Description: ${event.description}</li>
             <li>Date: ${event.date}</li>
             <li>Time: ${event.time}</li>
             <li>Venue: ${event.venue}</li>
             <li>Event Type: ${event.event}</li>
           </ul>`;
          await sendNotification(    
            email,                                  // to     
            'Event Registration Confirmation!',       // subject
            message // message
          );

      } catch (err) {
        console.error("Subscriber retrieval error:", err.message);
        return;
      } 
    });
      

    res.json({
      success: true,
      data: registration,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.getRegisteredUsers = async (req, res) => {
  try {
    const users = await Registration.find({ eventId: req.params.eventId });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Download to Excel
exports.exportRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const data = await Registrations.find({ eventId });

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No registrations found" });
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Registrations");

    sheet.columns = [
      { header: "Name", key: "name", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Notify", key: "notify", width: 10 },
    ];

    data.forEach((u) => {
      sheet.addRow({
        name: u.name,
        email: u.email,
        phone: u.phone,
        notify: u.notify ? "Yes" : "No",
      });
    });

    // Make header bold
    sheet.getRow(1).font = { bold: true };

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=event_${eventId}_registrations.xlsx`
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};