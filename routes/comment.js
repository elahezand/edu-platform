const express = require("express");
const commentRouter = express.Router();
const controller = require("../controllers/comment");

const { authAdmin, authUser } = require("../middlewares/authMiddleware");

commentRouter.get("/", controller.get);

commentRouter.post("/", authUser, controller.post);

commentRouter.post("/:id/answer", authAdmin, controller.answer);

commentRouter.post("/:id/accept", authAdmin, controller.accept);

commentRouter.patch("/:id", authAdmin, controller.patch);

commentRouter.delete("/:id", authAdmin, controller.remove);

module.exports = commentRouter;
