const axios = require("axios");

const sendEmail = async (email, message) => {
  return axios.post("http://localhost:5002/api/notify", {
    email,
    message,
  });
};

module.exports = { sendEmail };