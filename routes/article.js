const express = require("express");
const articleRouter = express.Router();
const controller = require("../controllers/article");
const upload = require("../middlewares/multer");
const { authAdmin } = require("../middlewares/authMiddleware");

// Get all articles
articleRouter.get("/", controller.get);

// Get single article
articleRouter.get("/:id", controller.getOne);

// Create article (Admin)
articleRouter.post(
  "/",
  authAdmin,
  upload.single("cover"), // cover image
  controller.post
);

// Edit article (Admin)
articleRouter.patch(
  "/:id",
  authAdmin,
  upload.single("cover"), // optional new cover image
  controller.patch
);

// Delete article (Admin)
articleRouter.delete("/:id", authAdmin, controller.remove);

module.exports = articleRouter;
