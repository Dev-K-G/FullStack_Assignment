const express = require("express");
const router = express.Router();

const { registerUser, getRegisteredUsers, exportRegistrations } = require("../controllers/registrationController.js");

const { verifyAdmin } = require("../middleware/auth.js");

router.post("/:eventId", registerUser);
router.get("/:eventId", verifyAdmin, getRegisteredUsers);

router.get("/export/:eventId", verifyAdmin, exportRegistrations); // For Download to Excel
module.exports = router;