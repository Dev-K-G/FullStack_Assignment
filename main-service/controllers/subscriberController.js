const subscribers = require("../models/subscribers.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.unsubscribe = async (req, res) => {
  try {
    const { token } = req.params;

    //console.log("TOKEN:", token);


    const decoded = jwt.verify(token, process.env.JWSKEY);

    //console.log("DECODED:", decoded);

    const email = decoded.email;

    await subscribers.deleteOne({
      email: email.toLowerCase().trim()
    });

    res.json({ message: "Unsubscribed successfully" });

  } catch (err) {
    console.error("UNSUB ERROR:", err.message);
    res.status(400).json({ message: "Invalid or expired link" });
  }
};

exports.getSubscribers = async(req, res) => {
  try {
      const users = await subscribers.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};