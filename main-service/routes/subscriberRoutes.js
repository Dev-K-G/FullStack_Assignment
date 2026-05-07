const express = require("express");
const router = express.Router();

const { unsubscribe, getSubscribers } = require("../controllers/subscriberController.js");

router.delete("/unsubscribe/:token", unsubscribe);
//router.get("/", getSubscribers);

module.exports = router;