const express = require("express");
const sessionRouter = express.Router();
const controller = require("../controllers/session");
const { authAdmin } = require("../middlewares/authMiddleware");
const upload = require("../utils/multer");

sessionRouter.get("/", authAdmin, controller.get);
sessionRouter.get("/:id", authAdmin, controller.getOne);
sessionRouter.get("/:shortName", authAdmin, controller.getSessionCourse);
sessionRouter.post("/", authAdmin, upload.single("videoUrl"), controller.post);
sessionRouter.patch("/:id", authAdmin, upload.single("videoUrl"), controller.patch);
sessionRouter.delete("/:id", authAdmin, controller.remove);

module.exports = sessionRouter;


