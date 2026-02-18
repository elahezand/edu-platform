const { z } = require("zod");
const mongoose = require("mongoose");

const objectId = (field = "ID") =>
  z.string().trim().refine(val => mongoose.Types.ObjectId.isValid(val), {
    message: `Invalid ${field} ID`,
  });
/*  Create Course Schema  */
const createCourseSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(3).lowercase(),
  description: z.string().trim().min(10).max(5000),
  price: z.number().nonnegative(),
  category: objectId("category"),
  instructor: objectId("instructor"),
  coverImage: z.string().min(1, "Cover image is required"),
  isActive: z.boolean().default(true),
  support: z.string().trim().min(1, "Support info is required"),
  discount: z.number().min(0).max(100).default(0),
});

/*  Update Course Schema  */
const updateCourseSchema = createCourseSchema.partial();

module.exports = {
  createCourseSchema,
  updateCourseSchema,
};