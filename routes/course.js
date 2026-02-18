const express = require("express");
const courseRouter = express.Router();
const controller = require("../controllers/course");
const upload = require("../utils/multer");
const { authAdmin, authUser } = require("../middlewares/authMiddleware");
const validateObjectIdParam = require("../middlewares/objectId")


// Public Routes
courseRouter.get("/", controller.getAll);
courseRouter.get("/category/:categoryName", controller.getCategoryCourses);
courseRouter.get("/related/:shortName", controller.getRelated);
courseRouter.get("/popular", controller.getPopular);
courseRouter.get("/:id",
  validateObjectIdParam("id"),
  controller.getOne);


// User Routes
courseRouter.post("/:id/register", authUser,
  validateObjectIdParam("id"),
  controller.register);

// Admin Routes
courseRouter.post(
  "/",
  upload.single("coverImage"),
  controller.post
);

courseRouter.patch(
  "/:id",
  authAdmin,
  validateObjectIdParam("id"),
  upload.single("coverImage"),
  controller.patch
);

courseRouter.delete("/:id",
  validateObjectIdParam("id"),
  controller.remove);

module.exports = courseRouter;
