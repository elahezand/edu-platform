const express = require("express");
const offRouter = express.Router();
const controller = require("../controllers/off");
const { authAdmin } = require("../middlewares/authMiddleware");

offRouter.get("/", authAdmin, controller.getAll);
offRouter.get("/:id", authAdmin, controller.getOne);
offRouter.post("/", authAdmin, controller.post);
offRouter.patch("/:id", authAdmin, controller.patch);
offRouter.delete("/:id", authAdmin, controller.remove);

module.exports = offRouter;
