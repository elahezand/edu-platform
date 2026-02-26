const express = require("express");
const newsLetterRouter = express.Router();
const controller = require("../controllers/newsletter");
const { authAdmin, identifyUser } = require("../middlewares/authMiddleware");

const validate = require("../middlewares/validate")
const createNewsletterSchema = require("../validators/newsLetter")


// GET all newsletters (admin only)
newsLetterRouter.get("/",
    identifyUser,
    authAdmin,
    controller.getAll);

// POST new newsletter
newsLetterRouter.post("/",
    validate(createNewsletterSchema),
    controller.post);

module.exports = newsLetterRouter;
