const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true }
});

module.exports =
  mongoose.models.Subscribers ||
  mongoose.model("Subscribers", subscriberSchema);