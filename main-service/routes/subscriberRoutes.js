const express = require("express");
const router = express.Router();

const { unsubscribe, getSubscribers } = require("../controllers/subscriberController.js");

const { verifyAdmin } = require("../middleware/auth.js");

router.delete("/unsubscribe/:token", unsubscribe);
router.get("/", verifyAdmin, getSubscribers);

module.exports = router;