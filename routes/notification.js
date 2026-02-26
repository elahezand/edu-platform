const express = require("express");
const notificationRouter = express.Router();
const controller = require("../controllers/notification");
const { authAdmin, identifyUser } = require("../middlewares/authMiddleware");
const validateObjectIdParam = require("../middlewares/objectId")

const validate = require("../middlewares/validate")
const { createNotificationSchema } = require("../validators/notification");

notificationRouter.get("/",
    identifyUser,
    authAdmin,
    controller.getAll);

notificationRouter.post("/", identifyUser,
    authAdmin,
    validate(createNotificationSchema),
    controller.post);

notificationRouter.get("/:id",
    identifyUser,
    authAdmin,
    validateObjectIdParam("id"),
    controller.get);

notificationRouter.put("/:id",
    identifyUser,
    authAdmin,
    validateObjectIdParam("id"),
    controller.seen);

notificationRouter.delete("/:id",
    identifyUser,
    authAdmin,
    validateObjectIdParam("id"),
    controller.remove);

module.exports = notificationRouter;
