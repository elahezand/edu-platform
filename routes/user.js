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

const { authAdmin, authUser } = require("../middlewares/authMiddleware");
const upload = require("../utils/multer");
const validateObjectIdParam = require("../middlewares/objectId")



userRouter.get("/", authAdmin, get);
userRouter.post("/", authAdmin, post);
userRouter.post("/ban", authAdmin, ban);

userRouter.put("/:id", authUser,
  validateObjectIdParam("id"),
  upload.single("avatar"), put);

userRouter.delete("/:id", authAdmin,
  validateObjectIdParam("id"),
  remove);


userRouter.patch("/role/:id", authAdmin,
  validateObjectIdParam("id"),
  toggleRole);

module.exports = userRouter;