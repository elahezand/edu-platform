const { z } = require("zod");
const { isValidObjectId } = require("mongoose");

/* ---------- helpers ---------- */
const objectId = (field) =>
  z.string().refine(val => isValidObjectId(val), {
    message: `Invalid ${field} ID`,
  });

/* ---------- Create Article ---------- */
const createArticleSchema = z.object({
  title: z.string().min(3).max(200),

  description: z.string().min(10).max(1000),

  body: z.string().min(20),

  shortName: z.string().min(3).max(100),

  categoryID: objectId("category"),

  publish: z.boolean()
});

/* ---------- Update Article ---------- */
const updateArticleSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).max(1000).optional(),
  body: z.string().min(20).optional(),
  shortName: z.string().min(3).max(100).optional(),
  categoryID: objectId("category").optional(),
  publish: z.boolean().optional()
});

/* ---------- ID Param ---------- */
const idParamSchema = z.object({
  id: objectId("article"),
});

module.exports = {
  createArticleSchema,
  updateArticleSchema,
  idParamSchema,
};
