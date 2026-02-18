const express = require("express");
const contactRouter = express.Router();
const controller = require("../controllers/contact");
const { authAdmin } = require("../middlewares/authMiddleware");
const validateObjectIdParam = require("../middlewares/objectId")


contactRouter.get("/", authAdmin, controller.get);
contactRouter.post("/", controller.post);

contactRouter.get("/:id", authAdmin,
    validateObjectIdParam("id"),
    controller.getOne);


contactRouter.delete("/:id", authAdmin,
    validateObjectIdParam("id"),
    controller.remove);


module.exports = contactRouter;
