const express = require("express");
const offRouter = express.Router();
const controller = require("../controllers/off");
const { authAdmin, authUser } = require("../middlewares/authMiddleware");
const validateObjectIdParam = require("../middlewares/objectId");

offRouter.get("/", authAdmin, controller.getAll);
offRouter.post("/", authAdmin, controller.post);
offRouter.post("/all", authAdmin, controller.setOnAll);

offRouter.patch("/:id", authAdmin,
    validateObjectIdParam("id"),
    controller.patch);

offRouter.delete("/:id", authAdmin,
    validateObjectIdParam("id"),
    controller.remove);

//apply off/
offRouter.post("/apply", authUser, controller.applyOff);

module.exports = offRouter;
