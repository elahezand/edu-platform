const express = require("express");
const authRouter = express.Router();
const controller = require("../controllers/auth");
const { authUser } = require("../middlewares/authMiddleware");

authRouter.post("/signup", controller.signup);
authRouter.post("/signin", controller.signin);
authRouter.get("/me", authUser, controller.getMe);
authRouter.post("/logout", controller.logout);
authRouter.post("/refresh", controller.refreshToken)

module.exports = authRouter;