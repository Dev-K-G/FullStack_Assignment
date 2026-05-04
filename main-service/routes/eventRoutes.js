const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  updateEventStatus
} = require("../controllers/eventController");

router.post("/", createEvent);
router.get("/", getEvents);
router.get("/:eventId/register", getEvent);
router.put("/:id", updateEventStatus);
router.delete("/:id", deleteEvent);

module.exports = router;