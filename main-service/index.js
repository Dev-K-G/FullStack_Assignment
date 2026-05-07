const express = require("express");
const cors = require("cors");
require("dotenv").config();
const subscriberRoutes = require("./routes/subscriberRoutes.js");
const eventRoutes = require("./routes/eventRoutes.js");
//const loginRoutes = require("./routes/loginRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");

const connectDB = require("./config/db.js");
const registrationRoutes = require("./routes/registrationRoutes.js");

const axios = require("axios");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');


const app = express();

// app.use(cors({
//   origin: "http://localhost:5001",
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
   next();   
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());           
app.use(express.json());

connectDB();

app.get("/ping", (req, res) => {
  res.send("Backend is working");
});
app.use("/api/register", registrationRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/subscribers", subscriberRoutes);

//Login Page
//app.use("/api/login", loginRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5001;

const swaggerDocument = YAML.load('docs/registration.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});



axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Use Bearer if your backend expects it
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

app.listen(PORT, () => {
  console.log(`Main service running on port ${PORT}`);
});