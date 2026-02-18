const express = require("express");
const categoryRouter = express.Router();
const controller = require("../controllers/category");
const { authAdmin } = require("../middlewares/authMiddleware");
const validateObjectIdParam = require("../middlewares/objectId")


categoryRouter.get("/", authAdmin, controller.get);
categoryRouter.post("/", authAdmin, controller.post);

categoryRouter.patch("/:id", authAdmin,
    validateObjectIdParam("id"),
    controller.patch);

categoryRouter.delete("/:id", authAdmin,
    validateObjectIdParam("id"),
    controller.remove);

module.exports = categoryRouter;