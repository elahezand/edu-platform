const express = require("express");
const articleRouter = express.Router();
const controller = require("../controllers/article");
const upload = require("../utils/multer");
const { authAdmin,identifyUser } = require("../middlewares/authMiddleware");
const validateObjectIdParam = require("../middlewares/objectId")
const validate = require("../middlewares/validate");
const { createArticleSchema, updateArticleSchema } = require("../validators/article");

articleRouter.get("/", controller.get);
articleRouter.get("/:id",validateObjectIdParam("id"),controller.getOne);

articleRouter.post(
  "/",
  identifyUser,
  authAdmin,
  upload.single("cover"),
  validate(createArticleSchema),
  controller.post
);

articleRouter.patch(
  "/:id",
  identifyUser,
  authAdmin,
  validateObjectIdParam("id"),
  upload.single("cover"),
  validate(updateArticleSchema),
  controller.patch
);

articleRouter.delete("/:id",
  identifyUser,
  authAdmin,
  validateObjectIdParam("id"),
  controller.remove);

module.exports = articleRouter;
