const express = require("express");
const router = express.Router();
const controller = require("../controllers/department");
const { authAdmin } = require("../middlewares/authMiddleware");
const validateObjectIdParam = require("../middlewares/objectId")

router.get("/", controller.get);
router.post("/", authAdmin, controller.post);

router.get("/:id",
    validateObjectIdParam("id"),
    controller.getOne);

router.patch("/:id", authAdmin,
    validateObjectIdParam("id"),
    controller.patch);

router.delete("/:id", authAdmin,
    validateObjectIdParam("id"),
    controller.remove);

module.exports = router;
