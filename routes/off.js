const express = require("express");
const offRouter = express.Router();
const controller = require("../controllers/off");
const { authAdmin, identifyUser } = require("../middlewares/authMiddleware");
const validateObjectIdParam = require("../middlewares/objectId");

const validate = require("../middlewares/validate")
const { createOffSchema, updateOffSchema } = require("../validators/off");

offRouter.get("/",
    identifyUser,
    authAdmin,
    controller.getAll);


offRouter.post("/all",
    identifyUser,
    authAdmin,
    validate(createOffSchema),
    controller.setOnAll);

offRouter.post("/",
    identifyUser,
    authAdmin,
    validate(createOffSchema),
    controller.post);

offRouter.patch("/:id",
    identifyUser,
    authAdmin,
    validateObjectIdParam("id"),
    validate(updateOffSchema),
    controller.patch);

offRouter.delete("/:id",
    identifyUser,
    authAdmin,
    validateObjectIdParam("id"),
    controller.remove);

//apply off/
offRouter.post("/apply",
    identifyUser,
    controller.applyOff);

module.exports = offRouter;
