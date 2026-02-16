const express = require("express");
const newsLetterRouter = express.Router();
const controller = require("../controllers/newsletter");
const { authAdmin } = require("../middlewares/authMiddleware");

// GET all newsletters (admin only)
newsLetterRouter.get("/", authAdmin, controller.getAll);

// POST new newsletter
newsLetterRouter.post("/", controller.post);

module.exports = newsLetterRouter;
