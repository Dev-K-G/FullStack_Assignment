// controllers/adminController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Hardcoded admin (you can move to DB later)
const ADMIN = {
  email: process.env.ADMIN_EMAIL,
  password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10)
};

console.log(ADMIN.email, " And ", ADMIN.password, " And ", process.env.JWSKEY);

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN.email) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = bcrypt.compareSync(password, ADMIN.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { role: "admin", email },
    process.env.JWSKEY,
    { expiresIn: "2h" }
  );

  res.json({ token });
};