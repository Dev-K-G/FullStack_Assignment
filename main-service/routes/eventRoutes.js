const express = require("express");
const router = express.Router();
const { verifyAdmin } = require("../middleware/auth.js");

const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  updateEventStatus
} = require("../controllers/eventController");


router.get("/", getEvents);
router.get("/:eventId", getEvent);
router.get("/:eventId/register", getEvent);

// protect create/update/delete
router.post("/", verifyAdmin, createEvent);
router.put("/:editingId", verifyAdmin, updateEvent);
router.put("/:_id", verifyAdmin, updateEventStatus);
router.delete("/:id", verifyAdmin, deleteEvent);


module.exports = router;