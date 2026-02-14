const express = require("express");
const router = express.Router();
const {
  get,
  post,
  edit,
  deleteUser,
  ban,
  role
} = require("../controllers/user");

const { authAdmin, authUser } = require("../middlewares/authMiddleware");

router.get("/", authAdmin, get);
router.post("/", authAdmin, post);
router.put("/:id", authUser, edit);
router.delete("/:id", authAdmin, deleteUser);
router.post("/ban", authAdmin, ban);
router.patch("/role/:id", authAdmin, role);

module.exports = router;