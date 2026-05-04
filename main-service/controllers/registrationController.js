const Registration = require("../models/Registration.js");
const subscribers = require("../models/Subscribers.js");
const { sendNotification } = require("../../notification-service/controllers/notificationController.js");

exports.registerUser = async (req, res) => {
  try {
    console.log("Received registration request:", req.body);
    const { name, email, event, notify, eventId } = req.body || {};
    // const { eventId } = req.params.eventId || {};

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
        const evnt = await Events.findOne({ eventId: eventId }); 
        const message = `<p>We are sorry to inform you that the event has been cancelled.</p>
          <h3>Event Details:</h3>
          <ul>
            <li>Title: ${event.title}</li>
            <li>Date: ${event.date}</li>
            <li>Time: ${event.time}</li>
            <li>Venue: ${event.venue}</li>
          </ul>`;
          await sendNotification(    
            email,                                  // to     
            'Event Registration Confirmation',       // subject
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