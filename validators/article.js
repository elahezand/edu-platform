const { z } = require("zod");

const mongoose = require("mongoose");

const objectId = (field = "ID") =>
  z.string().trim().refine(val => mongoose.Types.ObjectId.isValid(val), {
    message: `Invalid ${field} ID`,
  });
/*  Create Article  */
const createArticleSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(1000),
  body: z.string().min(20),
  shortName: z.string().min(3).max(100),
  categoryID: objectId("category"),
  publish: z.boolean()
});

/*  Update Article  */
const updateArticleSchema = createArticleSchema.partial()

module.exports = {
  createArticleSchema,
  updateArticleSchema,
};
