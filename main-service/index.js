const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db.js");
const registrationRoutes = require("./routes/registrationRoutes.js");

const app = express();

app.use(express.json());

connectDB();

app.use("/api/register", registrationRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Main service running on port ${PORT}`);
});