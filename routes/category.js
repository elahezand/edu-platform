const express = require("express");
const categoryRouter = express.Router();
const controller = require("../controllers/category");
const { authAdmin, identifyUser } = require("../middlewares/authMiddleware");

const validateObjectIdParam = require("../middlewares/objectId")
const validate = require("../middlewares/validate")
const {
    createCategorySchema,
    updateCategorySchema,
} = require("../validators/category");


categoryRouter.get("/", identifyUser, authAdmin, controller.get);
categoryRouter.post("/", identifyUser, authAdmin, validate(createCategorySchema), controller.post);

categoryRouter.patch("/:id",
    identifyUser,
    authAdmin,
    validateObjectIdParam("id"),
    validate(updateCategorySchema),
    controller.patch);

categoryRouter.delete("/:id", 
    identifyUser,
    authAdmin,
    validateObjectIdParam("id"),
    controller.remove);

module.exports = categoryRouter;