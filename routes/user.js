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


userRouter.get("/", authAdmin, get);
userRouter.post("/", authAdmin, post);
userRouter.put("/:id", authUser, upload.single("avatar"), put);
userRouter.delete("/:id", authAdmin, remove);
userRouter.post("/ban", authAdmin, ban);
userRouter.patch("/role/:id", authAdmin, toggleRole);

module.exports = userRouter;