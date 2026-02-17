const { z } = require("zod");
const { isValidObjectId } = require("mongoose");

/* ---------- helpers ---------- */
const objectId = (field) =>
  z.string().refine(val => isValidObjectId(val), {
    message: `Invalid ${field} ID`,
  });

/* ---------- Create Ticket ---------- */
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

/* ---------- Update Ticket ---------- */
const updateTicketSchema = z.object({
  departmentID: objectId("department").optional(),

  priority: z.number().int().min(0).optional(),

  title: z.string().min(3).max(200).optional(),

  body: z.string().min(5).optional(),

  user: objectId("user").optional(),

  answer: z.number().int().min(0).optional(),

  parent: objectId("parent").optional(),

  course: objectId("course").optional(),

  isAnswer: z.number().int().optional(),
});

/* ---------- ID Param ---------- */
const idParamSchema = z.object({
  id: objectId("ticket"),
});

module.exports = {
  createTicketSchema,
  updateTicketSchema,
  idParamSchema,
};
