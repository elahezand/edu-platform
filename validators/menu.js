const { z } = require("zod");
const { isValidObjectId } = require("mongoose");

/* ---------- helper ---------- */
const objectId = (field) =>
  z.string().refine(val => isValidObjectId(val), {
    message: `Invalid ${field} ID`
  });

const createMenuSchema = z.object({
  title: z.string().min(1, "Title is required"),
  href: z.string().min(1, "Href is required"),
  parent: z.string().optional().nullable(),
});

const updateMenuSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  href: z.string().min(1, "Href is required").optional(),
  parent: z.string().optional().nullable(),
});

/* ---------- ID Param ---------- */
const menuIdParamSchema = z.object({
  id: objectId("session")
});

module.exports = {
  createMenuSchema,
  updateMenuSchema,
  menuIdParamSchema,
};
