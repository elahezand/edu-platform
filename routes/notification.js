const express = require("express");
const notificationRouter = express.Router();
const controller = require("../controllers/notification");
const { authAdmin } = require("../middlewares/authMiddleware");
const validateObjectIdParam = require("../middlewares/objectId")

// Get all notifications (admin)
notificationRouter.get("/", authAdmin, controller.getAll);
// Create a new notification
notificationRouter.post("/", authAdmin, controller.post);

notificationRouter.get("/:id", authAdmin,
    validateObjectIdParam("id"),
    controller.get);

// Update a notification (optional)
notificationRouter.put("/:id", authAdmin,
    validateObjectIdParam("id"),
    controller.seen);

// Delete a notification
notificationRouter.delete("/:id", authAdmin,
    validateObjectIdParam("id"),
    controller.remove);

module.exports = notificationRouter;
