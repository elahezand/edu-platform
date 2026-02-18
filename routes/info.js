const express = require("express");
const router = express.Router();
const controller = require("../controllers/info");
const { authAdmin } = require("../middlewares/authMiddleware");
const validateObjectIdParam = require("../middlewares/objectId")

/*  Public  */
router.get("/", controller.get);

/*  Admin  */
router.post("/", authAdmin,
    validateObjectIdParam("id"),
    controller.post);

router.patch("/:id", authAdmin,
    validateObjectIdParam("id"),
    controller.patch);

router.delete("/:id", authAdmin,
    validateObjectIdParam("id"),

    controller.remove);

module.exports = router;
