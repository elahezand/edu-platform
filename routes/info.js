const express = require("express");
const router = express.Router();
const controller = require("../controllers/info");
const { authAdmin } = require("../middlewares/authMiddleware");

/* ========= Public ========= */
router.get("/", controller.get);

/* ========= Admin ========= */
router.post("/", authAdmin, controller.post);
router.patch("/:id", authAdmin, controller.patch);
router.delete("/:id", authAdmin, controller.remove);

module.exports = router;
