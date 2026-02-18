const express = require("express");
const courseRouter = express.Router();
const controller = require("../controllers/course");
const upload = require("../utils/multer");
const { authAdmin, authUser } = require("../middlewares/authMiddleware");

// Public Routes
courseRouter.get("/", controller.getAll);
courseRouter.get("/category/:categoryName", controller.getCategoryCourses);
courseRouter.get("/related/:shortName", controller.getRelated);
courseRouter.get("/:id", controller.getOne);
courseRouter.get("/popular", controller.getPopular);

// User Routes
courseRouter.post("/:id/register", authUser, controller.register);

// Admin Routes
courseRouter.post(
  "/",
  authAdmin,
  upload.single("coverImage"),
  controller.post
);
courseRouter.patch(
  "/:id",
  authAdmin,
  upload.single("coverImage"),
  controller.patch
);

courseRouter.delete("/:id", authAdmin, controller.remove);

module.exports = courseRouter;
