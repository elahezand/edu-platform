const express = require("express");
const menuRouter = express.Router();
const controller = require("../controllers/menu");
const { authAdmin } = require("../middlewares/authMiddleware");
const validateObjectIdParam = require("../middlewares/objectId")

menuRouter.get("/", controller.get);
menuRouter.post("/", authAdmin, controller.post);

menuRouter.get("/:id",
    validateObjectIdParam("id"),
    controller.getOne);

menuRouter.patch("/:id", authAdmin,
    validateObjectIdParam("id"),
    controller.patch);

menuRouter.delete("/:id", authAdmin,
    validateObjectIdParam("id"),
    controller.remove);

module.exports = menuRouter;
