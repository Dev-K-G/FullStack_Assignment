const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventId:{type:Number, required: true},
  title: { type: String, required: true, maxLength: [20, 'Username cannot exceed 20 characters']  },
  description: { type: String, required: true, maxLength: [200, 'Description cannot exceed 200 characters'] },
  date: { type: String, required: true },   // YYYY-MM-DD
  time: { type: String, required: true },   // HH:MM
  venue: { type: String, required: true },
  notify: { type: Boolean, default: false },
  event: { type: String, required: true },
  status: {
  type: String,
  enum: ["active", "cancelled", "updated", "deleted"],
  default: "active"
},
  createdAt: { type: Date, default: Date.now }
});

module.exports =
  mongoose.models.Events || mongoose.model("Events", eventSchema);