const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  updateEventStatus
} = require("../controllers/eventController");

router.post("/", createEvent);
router.get("/", getEvents);
router.put("/:id", updateEventStatus);
router.delete("/:id", deleteEvent);

module.exports = router;