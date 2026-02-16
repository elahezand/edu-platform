const express = require("express");
const menuRouter = express.Router();
const controller = require("../controllers/menu");
const { authAdmin } = require("../middlewares/authMiddleware");

menuRouter.get("/", controller.get);
menuRouter.get("/:id", controller.getOne);
menuRouter.post("/", authAdmin, controller.post);
menuRouter.patch("/:id", authAdmin, controller.patch);
menuRouter.delete("/:id", authAdmin, controller.remove);

module.exports = menuRouter;
