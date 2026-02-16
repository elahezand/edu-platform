const express = require("express");
const notificationRouter = express.Router();
const controller = require("../controllers/notification");
const { authAdmin } = require("../middlewares/authMiddleware");

// Get all notifications (admin)
notificationRouter.get("/", authAdmin, controller.getAll);

notificationRouter.get("/:id", authAdmin, controller.getOne);

// Create a new notification
notificationRouter.post("/", authAdmin, controller.post);

// Update a notification (optional)
notificationRouter.patch("/:id", authAdmin, controller.patch);

// Delete a notification
notificationRouter.delete("/:id", authAdmin, controller.remove);

module.exports = notificationRouter;
