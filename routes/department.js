const express = require("express");
const router = express.Router();
const controller = require("../controllers/department");
const { authAdmin } = require("../middlewares/authMiddleware");

router.get("/", controller.get);
router.get("/:id", controller.getOne);

router.post("/", authAdmin, controller.post);
router.patch("/:id", authAdmin, controller.patch);
router.delete("/:id", authAdmin, controller.remove);

module.exports = router;
