const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,

  date: { type: String, required: true },   // YYYY-MM-DD
  time: { type: String, required: true },   // HH:MM
  venue: { type: String, required: true },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Event", eventSchema);