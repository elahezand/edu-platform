const express = require("express");
const ticketRouter = express.Router();

const controller = require("../controllers/ticket");
const { authAdmin, authUser } = require("../middlewares/authMiddleware");
const validateObjectIdParam = require("../middlewares/objectId");

/* get all tickets (admin) */
ticketRouter.get("/", authAdmin, controller.getAll);
/* create ticket (user) */
ticketRouter.post("/", authUser, controller.create);
/* get tickets of a user */
ticketRouter.get("/user", authUser, controller.getMyTickets);
/* answer ticket */
ticketRouter.post(
  "/answer/:id",
  authAdmin,
  validateObjectIdParam("id"),
  controller.answer
);
/* get ticket answer */
ticketRouter.get(
  "/answer/:id",
  validateObjectIdParam("id"),
  controller.getOne
);

module.exports = ticketRouter;
