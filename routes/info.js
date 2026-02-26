const express = require("express");
const router = express.Router();
const controller = require("../controllers/info");
const { authAdmin, identifyUser } = require("../middlewares/authMiddleware");
const validateObjectIdParam = require("../middlewares/objectId")
const validate = require("../middlewares/validate")

const {
    createInfoSchema,
    updateInfoSchema,
} = require("../validators/info");

/*  Public  */
router.get("/", controller.get);

/*  Admin  */
router.post("/",
    identifyUser,
    authAdmin,
    validate(createInfoSchema),
    controller.post);

router.patch("/:id",
    identifyUser,
    authAdmin,
    validateObjectIdParam("id"),
    validate(updateInfoSchema),
    controller.patch);

router.delete("/:id",
    identifyUser,
    authAdmin,
    validateObjectIdParam("id"),
    controller.remove);

module.exports = router;
