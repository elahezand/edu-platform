const express = require("express");
const router = express.Router();
const controller = require("../controllers/department");
const { authAdmin, identifyUser } = require("../middlewares/authMiddleware");
const validateObjectIdParam = require("../middlewares/objectId")

const validate = require("../middlewares/validate")

const {
    createDepartmentSchema,
    updateDepartmentSchema,
} = require("../validators/department");

router.get("/", controller.get);
router.post("/", identifyUser, authAdmin,
    validate(createDepartmentSchema),
    controller.post);

router.get("/:id",
    validateObjectIdParam("id"),
    controller.getOne);

router.patch("/:id", identifyUser, authAdmin,
    validateObjectIdParam("id"),
    validate(updateDepartmentSchema),
    controller.patch);

router.delete("/:id", identifyUser, authAdmin,
    validateObjectIdParam("id"),
    controller.remove);

module.exports = router;
