const express = require("express");
const menuRouter = express.Router();
const controller = require("../controllers/menu");
const { authAdmin, identifyUser } = require("../middlewares/authMiddleware");
const validateObjectIdParam = require("../middlewares/objectId")

const { updateMenuSchema, createMenuSchema } = require("../validators/menu");
const validate = require("../middlewares/validate")


menuRouter.get("/", controller.get);
menuRouter.post("/",
    identifyUser,
    authAdmin,
    validate(createMenuSchema),
    controller.post);

menuRouter.get("/:id",
    validateObjectIdParam("id"),
    controller.getOne);

menuRouter.patch("/:id",
    identifyUser,
    authAdmin,
    validateObjectIdParam("id"),
    validate(updateMenuSchema),
    controller.patch);

menuRouter.delete("/:id",
    identifyUser,
    authAdmin,
    validateObjectIdParam("id"),
    controller.remove);

module.exports = menuRouter;
