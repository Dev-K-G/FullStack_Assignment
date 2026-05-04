const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema({
  eventId:{type:Number, required: true},
  name: String,
  email: String,
  event: String,
  notify: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Registration", RegistrationSchema);