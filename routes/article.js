const express = require("express");
const articleRouter = express.Router();
const controller = require("../controllers/article");
const upload = require("../middlewares/multer");
const { authAdmin } = require("../middlewares/authMiddleware");

articleRouter.get("/", controller.get);

articleRouter.get("/:id", controller.getOne);

articleRouter.post(
  "/",
  authAdmin,
  upload.single("cover"), 
  controller.post
);

articleRouter.patch(
  "/:id",
  authAdmin,
  upload.single("cover"),
  controller.patch
);

articleRouter.delete("/:id", authAdmin, controller.remove);

module.exports = articleRouter;
