const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verifyAdmin = (req, res, next) => {    
    //console.log("verify admin :",req," AND ",req.headers.authorization);
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  //console.log("VerifyAdmin : ", token);

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWSKEY || "SECRET_KEY"
    );

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    //console.log("VerifyAdmin : ", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};