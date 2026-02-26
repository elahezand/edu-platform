const express = require("express");
const sessionRouter = express.Router();
const controller = require("../controllers/session");
const { authAdmin, identifyUser } = require("../middlewares/authMiddleware");
const upload = require("../utils/multer");
const validateObjectIdParam = require("../middlewares/objectId")

const validate = require("../middlewares/validate")
const {
    createSessionSchema,
    updateSessionSchema,
} = require("../validators/session");


sessionRouter.get("/",
    identifyUser,
    authAdmin,
    controller.get);


sessionRouter.post("/",
    identifyUser,
    authAdmin, upload.single("videoUrl"),
    validate(createSessionSchema),
    controller.post);

sessionRouter.get("/:id",
    identifyUser,
    authAdmin,
    validateObjectIdParam("id"),
    controller.getOne);

sessionRouter.patch("/:id",
    identifyUser,
    authAdmin,
    validateObjectIdParam("id"),
    upload.single("videoUrl"),
    validate(updateSessionSchema),
    controller.patch);

sessionRouter.delete("/:id",
    identifyUser,
    authAdmin,
    validateObjectIdParam("id"),
    controller.remove);

sessionRouter.get("/:shortName",
    identifyUser,
    authAdmin,
    controller.getSessionCourse);


module.exports = sessionRouter;


