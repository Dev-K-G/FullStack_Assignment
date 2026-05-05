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
router.put("/:editingId", updateEvent);
router.put("/:_id", updateEventStatus);
router.delete("/:id", deleteEvent);

module.exports = router;