const express = require("express");
const contactRouter = express.Router();
const controller = require("../controllers/contact");
const { authAdmin, identifyUser } = require("../middlewares/authMiddleware");
const validateObjectIdParam = require("../middlewares/objectId")

const {
    createContactSchema,
} = require("../validators/contact");

const validate = require("../middlewares/validate")


contactRouter.get("/",
    identifyUser,
    authAdmin, controller.get);

contactRouter.post("/",
    validate(createContactSchema),
    controller.post);

contactRouter.get("/:id",
    identifyUser,
    authAdmin,
    validateObjectIdParam("id"),
    controller.getOne);


contactRouter.delete("/:id",
    identifyUser,
    authAdmin,
    validateObjectIdParam("id"),
    controller.remove);

contactRouter.post("/:id/answer",
    validateObjectIdParam("id"),
    controller.answer);

module.exports = contactRouter;
