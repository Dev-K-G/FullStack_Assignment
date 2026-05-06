// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { login } = require("../controllers/adminController.js");
const { verifyAdmin } = require("../middleware/auth.js");

router.post("/login", login);



module.exports = router;

