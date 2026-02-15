const { z } = require("zod");
const { isValidObjectId } = require("mongoose");

/* ---------- helpers ---------- */
const objectId = (field) =>
  z.string().refine(val => isValidObjectId(val), {
    message: `Invalid ${field} ID`,
  });

/* ---------- base fields ---------- */
const title = z
  .string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  })
  .trim()
  .min(2, "Title must be at least 2 characters")
  .max(100, "Title is too long");

const name = z
  .string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  })
  .trim()
  .toLowerCase()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name is too long")
  .regex(/^[a-z0-9-]+$/, "Name must be slug format (a-z, 0-9, -)");

/* ---------- create ---------- */
const createCategorySchema = z.object({
  title,
  name,
});

/* ---------- update ---------- */
const updateCategorySchema = z
  .object({
    title: title.optional(),
    name: name.optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

/* ---------- params ---------- */
const categoryIdParamSchema = z.object({
  id: objectId("category"),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
};
