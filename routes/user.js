const express = require("express");
const router = express.Router();
const {
  get,
  post,
  edit,
  remove,
  ban,
  role
} = require("../controllers/user");

const { authAdmin, authUser } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multer");


router.get("/", authAdmin, get);
router.post("/", authAdmin, post);
router.put("/:id", authUser, upload.single("avatar"), edit);
router.delete("/:id", authAdmin, remove);
router.post("/ban", authAdmin, ban);
router.patch("/role/:id", authAdmin, role);

module.exports = router;