const express = require("express");
const offRouter = express.Router();
const controller = require("../controllers/off");
const { authAdmin } = require("../middlewares/authMiddleware");
const validateObjectIdParam = require("../middlewares/objectId")


offRouter.get("/", authAdmin, controller.getAll);
offRouter.post("/", authAdmin, controller.post);

offRouter.get("/:id", authAdmin,
    validateObjectIdParam("id"),
    controller.getOne);

offRouter.patch("/:id", authAdmin,
    validateObjectIdParam("id"),
    controller.patch);

offRouter.delete("/:id", authAdmin,
    validateObjectIdParam("id"),
    controller.remove);

module.exports = offRouter;
