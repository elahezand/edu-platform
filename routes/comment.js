const express = require("express");
const commentRouter = express.Router();
const controller = require("../controllers/comment");
const validateObjectIdParam = require("../middlewares/objectId")
const { authAdmin, authUser, identifyUser } = require("../middlewares/authMiddleware");

const {
    createCommentSchema,
    answerCommentSchema,
    updateCommentSchema,
} = require("../validators/comment");

const validate = require("../middlewares/validate")

commentRouter.get("/", controller.get);

commentRouter.post("/",
    identifyUser,
    validate(createCommentSchema),
    controller.post);

commentRouter.post("/:id/answer",
    identifyUser,
    authAdmin,
    validateObjectIdParam("id"),
    validate(answerCommentSchema),
    controller.answer);

commentRouter.post("/:id/accept",
    identifyUser,
    authAdmin,
    validateObjectIdParam("id"),
    controller.accept);

commentRouter.patch("/:id",
    identifyUser,
    authAdmin,
    validateObjectIdParam("id"),
    validate(updateCommentSchema),
    controller.patch);

commentRouter.delete("/:id",
    identifyUser,
    authAdmin,
    validateObjectIdParam("id"),
    controller.remove);

module.exports = commentRouter;
