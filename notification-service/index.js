const express = require("express");
const cors = require("cors");
require("dotenv").config();

const notificationRoutes = require("./routes/notificationRoutes.js");

const app = express();
app.use(express.json());

app.use("/api/notify", notificationRoutes);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});