const { z } = require("zod");
const { isValidObjectId } = require("mongoose");

/* ---------- helper ---------- */
const objectId = (field) =>
  z.string().refine(val => isValidObjectId(val), {
    message: `Invalid ${field} ID`
  });

/* ---------- Create Session ---------- */
const createSessionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(150, "Title too long"),

  description: z
    .string()
    .max(2000, "Description too long")
    .optional()
    .or(z.literal("")),

  course: objectId("course"),

  videoUrl: z
    .string()
    .url("Invalid video URL"),

  duration: z
    .number({ invalid_type_error: "Duration must be a number" })
    .int("Duration must be an integer")
    .positive("Duration must be positive"),

  order: z
    .number({ invalid_type_error: "Order must be a number" })
    .int("Order must be an integer")
    .min(1, "Order must be at least 1"),

  isFree: z.boolean().optional()
});

/* ---------- Update Session ---------- */
const updateSessionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(150, "Title too long")
    .optional(),

  description: z
    .string()
    .max(2000, "Description too long")
    .optional()
    .or(z.literal("")),

  course: objectId("course").optional(),

  videoUrl: z
    .string()
    .url("Invalid video URL")
    .optional(),

  duration: z
    .number({ invalid_type_error: "Duration must be a number" })
    .int("Duration must be an integer")
    .positive("Duration must be positive")
    .optional(),

  order: z
    .number({ invalid_type_error: "Order must be a number" })
    .int("Order must be an integer")
    .min(1, "Order must be at least 1")
    .optional(),

  isFree: z.boolean().optional()
});

/* ---------- ID Param ---------- */
const sessionIdParamSchema = z.object({
  id: objectId("session")
});

/* ---------- export ---------- */
module.exports = {
  createSessionSchema,
  updateSessionSchema,
  sessionIdParamSchema
};
