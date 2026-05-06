const Events = require("../models/events.js");
const { sendNotification } = require("../../notification-service/controllers/notificationController.js");
const subscribers = require("../models/subscribers.js");
const Registrations = require("../models/Registration.js");


const getNextEventId = async () => {
  const lastEvent = await Events.findOne()
    .sort({ eventId: -1 })
    .lean();

  const lastId = Number(lastEvent?.eventId);

  return Number.isFinite(lastId) ? lastId + 1 : 1;
};

const getEmails = async (status, eventId) => {
  
  const subs = await subscribers.find({}, { email: 1, _id: 0 });
  let emails = subs.map(u => u.email.trim().toLowerCase());

        if (status === "cancelled") {
          const regs = await Registrations.find({ eventId: eventId });
          const regEmails = regs.map(u => u.email.trim().toLowerCase());
          emails = [...new Set([...emails, ...regEmails])];
        }
  return emails;
}

const emailTemplate = (status, event) => {
  if (status === "cancelled") {
  }
}

//create messag based on event status : created, updated, cancelled, deleted
const createMessage = (status, event) => {
  let subject, message = "";
  if (status === "created") {
    subject = "New Event Created!";
    message = `<p>Dear Subscriber,</p><p><strong>New Event Is Created!</strong></p>
    <h3>Event Details:</h3>
    <ul>
      <li>Title: ${event.title}</li>
      <li>Date: ${event.date}</li>
      <li>Time: ${event.time}</li>
      <li>Venue: ${event.venue}</li>
    </ul>          
    <p>Thank you for being with us.</p>
    <p>You can register here: <a href="http://localhost:5173/events/${event.eventId}/register">Event Registration</a></p>`;

  } else if (status === "updated") {
    subject = "Event Updated!";
    message = `<p>Dear User,</p><p><strong>Please Note: Below Event Has Been Updated!</strong></p>
    <h3>Event Details:</h3>
    <ul>
      <li>Title: ${event.title}</li>
      <li>Date: ${event.date}</li>
      <li>Time: ${event.time}</li>
      <li>Venue: ${event.venue}</li>
    </ul>
    <p>Thank you for being with us.</p>`;
  } else 
        if (status === "cancelled") {
          subject = "Event Cancelled!";
          message = `<p>Dear User,</p><p><strong>We regret to inform you that the following event has been cancelled.</strong></p>
          <h3>Event Details:</h3>
          <ul>
            <li>Title: ${event.title}</li>
            <li>Date: ${event.date}</li>
            <li>Time: ${event.time}</li>
            <li>Venue: ${event.venue}</li>
          </ul>
          <p>We apologize for any inconvenience caused.</p>`;
          
        }

  console.log("Generated message for status:", status, "\nSubject:", subject, "\nMessage:", message);
  return { subject, message };
};

// CREATE EVENT
exports.createEvent = async (req, res) => {
  try {
   console.log("Received create event request:", req.body);
    const nextEventId = await getNextEventId();   //increment eventId logic    
    const event = await Events.create({
      ...req.body,
      eventId: nextEventId
    });

    // Send response immediately
    res.status(201).json({
      success: true,
      data: event
    });

    // Background job
    setImmediate(async () => {
      try {
        const users = await subscribers.find();        
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
    console.log("Fetching events from server...");
    const events = await Events.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateEvent = async (req, res) => {
  try {    
    console.log("Received update event updateEvent request for ID: ", req.params.editingId, req.body);
    console.log("Request body:", req.params.editedId);
    const event = await Events.findByIdAndUpdate(
      {_id: req.params.editingId},
      req.body,
      { new: true }
    );
    res.json(event);
    console.log("Event updated successfully:", event);
    
    // Background job (do NOT await)
    process.nextTick(async () => {
      try {
        const emails = getEmails(event.status, req.body.eventId);
        //emails = registeredEmails ? [...new Set([...registeredEmails, subscribersEmails])] : emails;
        console.log("Emails to notify for event update:", emails);        
        if(emails && emails.length > 0)
        {
          const {subject, message} = createMessage(req.body.status || "active", event);
          const result = await Promise.allSettled(
            emails.map(email =>
              sendNotification(
              email,
              "Event Updated!",
              message
              )
            )
          );
          const successCount = result.filter(r => r.status === "fulfilled").length;
          const failCount = result.filter(r => r.status === "rejected").length;
          console.log(`✅ Emails sent: ${successCount}, ❌ Failed: ${failCount}`);
        }           

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
    console.log("Event deleted successfully, ID:", req.body, req.params.id);
    await Events.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateEventStatus = async (req, res) => {
  try {
    console.log("Received status update request:", req.params._id, req.body);
    const { status } = req.body.status ? req.body.status : "active" ;
//     await Events.findByIdAndUpdate(
//   {_id: req.params._id},
//   req.body,
//   { new: true }
// );
//res.json({ message: "Event updated" });
  res.json(event);   

    process.nextTick(async () => {
      try {     
        
        const event = await Events.findOne({eventId: req.body.eventId});
        const emails = getEmails(event.status, event.eventId);

        // const subscribersEmails = await subscribers.find().project({ email: 1, _id: 0 }).toArray();
        // const emails = subscribersEmails ? [...new Set(subscribersEmails.map(u => u.email.trim().toLowerCase()))] : [];

        // if (status === "cancelled") {
        // const registeredUsers = await Registrations.find({ eventId: event.eventId });
        // const registeredEmails = registeredUsers? [...new Set(registeredUsers.map(u => u.email.trim().toLowerCase()))] : [];
          
        // emails = registeredEmails ? [...new Set([...registeredEmails, subscribersEmails])] : emails;
        //console.log("Emails to notify for event cancellation:", emails);
          
          // message = `<p>We are sorry to inform you that the event has been cancelled.</p>
          // <h3>Event Details:</h3>
          // <ul>
          //   <li>Title: ${event.title}</li>
          //   <li>Date: ${event.date}</li>
          //   <li>Time: ${event.time}</li>
          //   <li>Venue: ${event.venue}</li>
          // </ul>          
          // `;       

        //}
        
        if(emails && emails.length > 0)
        {
          const {subject, message} = createMessage(req.body.status || "active", event);
          await Promise.allSettled(
            emails.map(email => sendNotification(email, status, message))
          );
          const successCount = result.filter(r => r.status === "fulfilled").length;
          const failCount = result.filter(r => r.status === "rejected").length;
          console.log(`✅ Emails sent: ${successCount}, ❌ Failed: ${failCount}`);
          console.log("✅ Emails processed:", emails.length);
        }   

        
      } catch (err) {
        console.error("❌ Background email error:", err.message);
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Read Specific Event
exports.getEvent = async (req, res) => {
  try {
    console.log("Received get event request for ID:", req.params.eventId);
    const event = await Events.findOne({
      eventId: req.params.eventId
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};