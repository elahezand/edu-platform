const express = require("express");
const contactRouter = express.Router();
const controller = require("../controllers/contact");
const { authAdmin } = require("../middlewares/authMiddleware");

contactRouter.get("/", authAdmin, controller.get);
contactRouter.get("/:id", authAdmin, controller.getOne);
contactRouter.post("/", controller.post);
contactRouter.delete("/:id", authAdmin, controller.remove);


module.exports = contactRouter;
