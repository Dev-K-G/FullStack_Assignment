const express = require("express");
const router = express.Router();

const { registerUser } = require("../controllers/registrationController.js");

router.post("/", registerUser);

module.exports = router;