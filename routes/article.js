const express = require("express");
const articleRouter = express.Router();
const controller = require("../controllers/article");
const upload = require("../utils/multer");
const { authAdmin } = require("../middlewares/authMiddleware");
const validateObjectIdParam = require("../middlewares/objectId")

articleRouter.get("/", controller.get);

articleRouter.get("/:id",
  validateObjectIdParam("id"),
  controller.getOne);

articleRouter.post(
  "/",
  authAdmin,
  upload.single("cover"),
  controller.post
);

articleRouter.patch(
  "/:id",
  authAdmin,
  validateObjectIdParam("id"),
  upload.single("cover"),
  controller.patch
);

articleRouter.delete("/:id", authAdmin,
  validateObjectIdParam("id"),
  controller.remove);

module.exports = articleRouter;
