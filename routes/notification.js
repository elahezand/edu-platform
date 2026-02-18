const express = require("express");
const notificationRouter = express.Router();
const controller = require("../controllers/notification");
const { authAdmin } = require("../middlewares/authMiddleware");
const validateObjectIdParam = require("../middlewares/objectId")

// Get all notifications (admin)
notificationRouter.get("/", authAdmin, controller.getAll);

notificationRouter.get("/:id", authAdmin,
    validateObjectIdParam("id"),
    controller.getOne);

// Create a new notification
notificationRouter.post("/", authAdmin,
    validateObjectIdParam("id"),
    controller.post);

// Update a notification (optional)
notificationRouter.patch("/:id", authAdmin,
    validateObjectIdParam("id"),
    controller.patch);

// Delete a notification
notificationRouter.delete("/:id", authAdmin,
    validateObjectIdParam("id"),
    controller.remove);

module.exports = notificationRouter;
