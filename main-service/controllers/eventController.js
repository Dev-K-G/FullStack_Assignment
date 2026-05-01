const Event = require("../models/Event");
const { sendNotification } = require("../../notification-service/controllers/notificationController.js");
const Registration = require("../models/Registration");


// CREATE
exports.createEvent = async (req, res) => {
  try {
    // ✅ 1. Create event
    const event = await Event.create(req.body);

    // ✅ 2. Respond immediately (FAST)
    res.json({
      success: true,
      data: event
    });

    // ✅ 3. Background job (do NOT await)
    process.nextTick(async () => {
      try {
        const users = await Registration.find({}, "email");

        // remove duplicates
        const emails = [...new Set(users.map(u => u.email))];

        const message = `
New Event Created!

Title: ${event.title}
Date: ${event.date}
Time: ${event.time}
Venue: ${event.venue}
        `;

        // send emails in parallel
        await Promise.allSettled(
          emails.map(email => sendNotification(email, message))
        );

        console.log("✅ Emails processed:", emails.length);

      } catch (err) {
        console.error("❌ Background email error:", err.message);
      }
    });

  } catch (err) {
    console.error("❌ Create event error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};