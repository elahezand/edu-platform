const { z } = require("zod");
const { isValidObjectId } = require("mongoose");

// helper objectId
const objectId = (field) =>
  z.string().refine((val) => isValidObjectId(val), {
    message: `Invalid ${field} ID`,
  });

// Create Ticket Schema
const createTicketSchema = z.object({
  departmentID: objectId("department"),
  priority: z.number().int().min(0),
  title: z.string().min(3).max(200),
  body: z.string().min(5),
  parent: objectId("parent").optional(),
  course: objectId("course").optional(),
});

// Update Ticket Schema
const updateTicketSchema = createTicketSchema.partial();

module.exports = {
  createTicketSchema,
  updateTicketSchema,
};
