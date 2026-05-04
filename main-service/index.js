const express = require("express");
const cors = require("cors");
require("dotenv").config();
const adminRoutes = require("./routes/adminRoutes.js");
const eventRoutes = require("./routes/eventRoutes.js");

const connectDB = require("./config/db.js");
const registrationRoutes = require("./routes/registrationRoutes.js");

const app = express();

app.use(cors());           
app.use(express.json());

connectDB();

app.get("/ping", (req, res) => {
  res.send("Backend is working");
});
app.use("/api/register", registrationRoutes);
app.use("/api/events", eventRoutes);
// app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Main service running on port ${PORT}`);
});