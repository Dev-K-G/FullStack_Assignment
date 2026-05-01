const express = require("express");
const router = express.Router();

const { sendNotification } = require("../controllers/notificationController.js");

router.post("/", sendNotification);

module.exports = router;