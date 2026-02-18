const express = require("express");
const commentRouter = express.Router();
const controller = require("../controllers/comment");
const validateObjectIdParam = require("../middlewares/objectId")
const { authAdmin, authUser } = require("../middlewares/authMiddleware");

commentRouter.get("/", controller.get);

commentRouter.post("/", authUser, controller.post);

commentRouter.post("/:id/answer", authAdmin,
    validateObjectIdParam("id"),
    controller.answer);

commentRouter.post("/:id/accept", authAdmin,
    validateObjectIdParam("id"),
    controller.accept);

commentRouter.patch("/:id", authAdmin,
    validateObjectIdParam("id"),
    controller.patch);

commentRouter.delete("/:id", authAdmin,
    validateObjectIdParam("id"),
    controller.remove);

module.exports = commentRouter;
