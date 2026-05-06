const { verifyAdmin } = require("../controllers/loginController.js");

// protect create/update/delete
router.post("/", verifyAdmin, createEvent);
router.put("/:id", verifyAdmin, updateEvent);
router.delete("/:id", verifyAdmin, deleteEvent);