const express = require("express");
const router = express.Router();

const { registerUser } = require("../controllers/registrationController.js");

router.post("/:eventId", registerUser);

module.exports = router;