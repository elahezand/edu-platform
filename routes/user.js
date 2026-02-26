const express = require("express");
const userRouter = express.Router();
const {
  get,
  post,
  put,
  remove,
  ban,
  toggleRole
} = require("../controllers/user");

const { authAdmin, identifyUser } = require("../middlewares/authMiddleware");

const upload = require("../utils/multer");
const validateObjectIdParam = require("../middlewares/objectId")

const validate = require("../middlewares/validate")
const { createUserSchema, updateUserSchema } = require("../validators/user");


userRouter.get("/",
  identifyUser,
  authAdmin,
  get);

userRouter.post("/ban",
  identifyUser,
  authAdmin, ban);

userRouter.post("/",
  identifyUser,
  authAdmin,
  validate(createUserSchema),
  post);

userRouter.put("/:id",
  identifyUser,
  validateObjectIdParam("id"),
  upload.single("avatar"),
  validate(updateUserSchema),
  put);

userRouter.delete("/:id",
  identifyUser,
  authAdmin,
  validateObjectIdParam("id"),
  remove);


userRouter.patch("/role/:id",
  identifyUser,
  authAdmin,
  validateObjectIdParam("id"),
  toggleRole);

module.exports = userRouter;