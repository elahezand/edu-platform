const express = require("express");
const ticketRouter = express.Router();

const controller = require("../controllers/ticket");
const { authAdmin, identifyUser } = require("../middlewares/authMiddleware");
const validateObjectIdParam = require("../middlewares/objectId");

const validate = require("../middlewares/validate")
const { createTicketSchema } = require("../validators/ticket");

ticketRouter.get("/",
  identifyUser,
  authAdmin,
  controller.getAll);

ticketRouter.post("/",
  identifyUser,
  validate(createTicketSchema),
  controller.create);

ticketRouter.get("/user",
  identifyUser,
  controller.getMyTickets);


ticketRouter.post(
  "/answer/:id",
  identifyUser,
  authAdmin,
  validateObjectIdParam("id"),
  controller.answer
);

ticketRouter.get(
  "/answer/:id",
  identifyUser,
  validateObjectIdParam("id"),
  controller.getOne
);

module.exports = ticketRouter;
