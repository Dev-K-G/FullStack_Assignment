const Event = require("../models/Event");
const { sendNotification } = require("../../notification-service/controllers/notificationController.js");
const Registration = require("../models/Registration");
const subscribers = require("../models/subscribers.js");


const getNextEventId = async () => {
  const lastEvent = await Event.findOne()
    .sort({ eventId: -1 })
    .lean();

  const lastId = Number(lastEvent?.eventId);

  return Number.isFinite(lastId) ? lastId + 1 : 1;
};

//create messag based on event status : created, updated, cancelled, deleted
const createMessage = (status, event) => {
  let subject, message = "";
  if (status === "created") {
    subject = "New Event Created!";
    message = `<p>Dear Subscriber,</p><p><strong>New Event Is Created!</strong></p>
    <h3>Event Details:</h3>'
    <ul>
      <li>Title: ${event.title}</li>
      <li>Date: ${event.date}</li>
      <li>Time: ${event.time}</li>
      <li>Venue: ${event.venue}</li>
    </ul>          
    <p>Thank you for being with us.</p>
    <p>You can register here: <a href="http://localhost:3000/events/${event.eventId}">Event Registration</a></p>`;

  } else if (status === "updated") {
    subject = "Event Updated!";
    message = `<p>Dear Subscriber,</p><p><strong>Please Note: Below Event Has Been Updated!</strong></p>
    <h3>Event Details:</h3>
    <ul>
      <li>Title: ${event.title}</li>
      <li>Date: ${event.date}</li>
      <li>Time: ${event.time}</li>
      <li>Venue: ${event.venue}</li>
    </ul>
    <p>Thank you for being with us.</p>`;
  }

  return { subject, message };
};

// CREATE EVENT
exports.createEvent = async (req, res) => {
  try {
   console.log("Received create event request:", req.body);
    const nextEventId = await getNextEventId();   //increment eventId logic    
    const event = await Event.create({
      ...req.body,
      eventId: nextEventId
    });

    // 3. Send response immediately
    res.status(201).json({
      success: true,
      data: event
    });

    // 4. Background job
    setImmediate(async () => {
      try {
        const users = await subscribers.find(
          { notify: true },
          "email"
        );

        if (!users.length) {
          console.log("ℹ️ No subscribed users found");
          return;
        }

        const emails = [
          ...new Set(
            users
              .map(u => u.email)
              .filter(Boolean)
              .map(e => e.trim().toLowerCase())
          )
        ];

        if (!emails.length) {
          console.log("ℹ️ No valid emails to send");
          return;
        }

        

        const { subject, message } = createMessage("created", event);

        const results = await Promise.allSettled(
          emails.map(email => sendNotification(email, subject, message))
        );

        const successCount = results.filter(r => r.status === "fulfilled").length;
        const failCount = results.filter(r => r.status === "rejected").length;

        console.log(`✅ Emails sent: ${successCount}, ❌ Failed: ${failCount}`);

      } catch (err) {
        console.error("❌ Background email error:", err.message);
      }
    });

  } catch (err) {
    console.error("❌ Create event error:", err.message);

    // Handle duplicate key error (just in case)
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "Duplicate eventId detected. Try again."
      });
    }

    res.status(500).json({
      success: false,
      error: err.message
    });
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

    // 3. Background job (do NOT await)
    process.nextTick(async () => {
      try {
            const users = await Registration.find(
            { notify: true },   //  only subscribed users
            "email"
            );
        // remove duplicates
        const emails = [...new Set(users.map(u => u.email.trim().toLowerCase()))];
        const message = `Event Updated!
            Title: ${event.title}
            Date: ${event.date}
            Time: ${event.time}
            Venue: ${event.venue}
          `;
        // send emails in parallel
        // await Promise.allSettled(
        //   emails.map(email => sendNotification(email, message))
        // );

        Promise.allSettled(
          emails.map(email =>
          sendNotification(
          email,
          // `New Event: ${event.title}
          //   Date: ${event.date}
          //   Time: ${event.time}
          //   Venue: ${event.venue}`
          message
          )
    )
);
        console.log("✅ Emails processed:", emails.length);
      } catch (err) {
        console.error("❌ Background email error:", err.message);
      }
    });


  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });

    if (status === "cancelled") {
      // 3. Background job (do NOT await)
    process.nextTick(async () => {
      try {
            const users = await Registration.find(
            { notify: true },   //  only subscribed users
            "email"
            );
        // remove duplicates
        const emails = [...new Set(users.map(u => u.email.trim().toLowerCase()))];
        const message = `New Event Created!
            Title: ${event.title}
            Date: ${event.date}
            Time: ${event.time}
            Venue: ${event.venue}
          `;
        // send emails in parallel
        // await Promise.allSettled(
        //   emails.map(email => sendNotification(email, message))
        // );

        Promise.allSettled(
          emails.map(email =>
          sendNotification(
          email,
          // `New Event: ${event.title}
          //   Date: ${event.date}
          //   Time: ${event.time}
          //   Venue: ${event.venue}`
          message
          )
    )
);
        console.log("✅ Emails processed:", emails.length);
      } catch (err) {
        console.error("❌ Background email error:", err.message);
      }
    });
    }


  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateEventStatus = async (req, res) => {
  try {
    console.log("Received status update request:", req.params.id, req.body);
    const { status } = req.body;

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(event);
    

    process.nextTick(async () => {
      try {
        const users = await Registration.find({ notify: true }, "email");

        const emails = [...new Set(users.map(u => u.email.trim().toLowerCase()))];

        let message = "";

        if (status === "cancelled") {
          message = `<p>We are sorry to inform you that the event has been cancelled.</p>
          <h3>Event Details:</h3>
          <ul>
            <li>Title: ${event.title}</li>
            <li>Date: ${event.date}</li>
            <li>Time: ${event.time}</li>
            <li>Venue: ${event.venue}</li>
          </ul>          
          `;
        }

        if (status === "updated") {
          message = `<p>Thank you for registering for our event.</p><p><strong>Event Updated!</strong></p>
          <h3>Event Details:</h3>
          <ul>
            <li>Title: ${event.title}</li>
            <li>Date: ${event.date}</li>
            <li>Time: ${event.time}</li>
            <li>Venue: ${event.venue}</li>
          </ul>          
          `; 
        }

        if (status === "deleted") {
          message = `Event Deleted!
Title: ${event.title}`;
        }
console.log("Prepared message for status update:", message);
        await Promise.allSettled(
          emails.map(email => sendNotification(email, status, message))
        );

        console.log("✅ Emails processed:", emails.length);
      } catch (err) {
        console.error("❌ Background email error:", err.message);
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};