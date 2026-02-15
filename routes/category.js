const express = require("express");
const categoryRouter = express.Router();
const controller = require("../controllers/category");
const { authAdmin } = require("../middlewares/authMiddleware");

categoryRouter.get("/", authAdmin, controller.get);
categoryRouter.post("/", authAdmin, controller.post);
categoryRouter.patch("/:id", authAdmin, controller.patch);
categoryRouter.delete("/:id", authAdmin, controller.remove);

module.exports = categoryRouter;