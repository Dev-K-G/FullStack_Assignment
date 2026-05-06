const express = require("express");
const router = express.Router();

const { registerUser, getRegisteredUsers, exportRegistrations } = require("../controllers/registrationController.js");

router.post("/:eventId", registerUser);
router.get("/:eventId", getRegisteredUsers);

router.get("/export/:eventId", exportRegistrations); // For Download to Excel
module.exports = router;