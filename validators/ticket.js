const { z } = require("zod");

/*  Create Ticket  */
const createTicketSchema = z.object({
  departmentID: objectId("department"),

  priority: z.number().int().min(0),

  title: z.string().min(3).max(200),

  body: z.string().min(5),

  user: objectId("user"),

  answer: z.number().int().min(0),

  parent: objectId("parent").optional(),

  course: objectId("course").optional(),

  isAnswer: z.number().int().optional(),
});

/*  Update Ticket  */
const updateTicketSchema = createTicketSchema.partial()

module.exports = {
  createTicketSchema,
  updateTicketSchema,
};
