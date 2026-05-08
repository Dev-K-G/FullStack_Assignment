const express = require("express");
const router = express.Router();

const { registerUser, getRegisteredUsers, exportRegistrations, deleteRegisteredUsers } = require("../controllers/registrationController.js");

const { verifyAdmin } = require("../middleware/auth.js");

router.post("/:eventId", registerUser);

router.get("/:eventId", verifyAdmin, getRegisteredUsers);
router.delete("/events/:eventId", verifyAdmin, deleteRegisteredUsers);

router.get("/export/:eventId", verifyAdmin, exportRegistrations); // For Download to Excel
module.exports = router;