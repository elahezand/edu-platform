const express = require("express");
const sessionRouter = express.Router();
const controller = require("../controllers/session");
const { authAdmin } = require("../middlewares/authMiddleware");
const upload = require("../utils/multer");
const validateObjectIdParam = require("../middlewares/objectId")


sessionRouter.get("/", authAdmin, controller.get);
sessionRouter.get("/:shortName", authAdmin, controller.getSessionCourse);
sessionRouter.post("/", authAdmin, upload.single("videoUrl"), controller.post);

sessionRouter.get("/:id", authAdmin,
    validateObjectIdParam("id"),
    controller.getOne);

sessionRouter.patch("/:id", authAdmin,
    validateObjectIdParam("id"),
    upload.single("videoUrl"), controller.patch);

sessionRouter.delete("/:id", authAdmin,
    validateObjectIdParam("id"),
    controller.remove);

module.exports = sessionRouter;


