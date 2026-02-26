const express = require("express");
const authRouter = express.Router();
const controller = require("../controllers/auth");
const { identifyUser } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate")
const z = require("zod");
const userValidationSchema = require("../validators/user")


const signinSchema = z.object({
    identifier: z.string(),
    password: z.string().min(6)
});

authRouter.post("/signup", validate(userValidationSchema), controller.signup);
authRouter.post("/signin", validate(signinSchema), controller.signin);
authRouter.get("/me", identifyUser, controller.getMe);
authRouter.post("/logout", identifyUser, controller.logout);
authRouter.post("/refresh", controller.refreshToken)

module.exports = authRouter;