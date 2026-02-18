const { z } = require("zod");
const mongoose = require("mongoose");

const objectId = (field = "ID") =>
  z.string().trim().refine(val => mongoose.Types.ObjectId.isValid(val), {
    message: `Invalid ${field} ID`,
  });
const optionalText = (max) =>
  z.string()
    .trim()
    .max(max)
    .transform(v => (v === "" ? undefined : v))
    .optional();

/* Create Session */
const createSessionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(150, "Title too long"),

  description: optionalText(2000),

  course: objectId("course"),

  videoUrl: z.string().trim().url("Invalid video URL"),

  duration: z.coerce
    .number({ invalid_type_error: "Duration must be a number" })
    .int("Duration must be an integer")
    .positive("Duration must be positive"),

  order: z.coerce
    .number({ invalid_type_error: "Order must be a number" })
    .int("Order must be an integer")
    .min(1, "Order must be at least 1"),

  isFree: z.boolean().optional().default(false)
});

/* Update Session */
const updateSessionSchema = createSessionSchema
  .omit({ course: true }) 
  .extend({
    course: objectId("course").optional(),
    description: optionalText(2000)
  })
  .partial();

module.exports = {
  createSessionSchema,
  updateSessionSchema,
};
