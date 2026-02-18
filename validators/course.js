const { z } = require("zod");
const { isValidObjectId } = require("mongoose");

/*  helpers  */
const objectId = (field) =>
  z.string().refine(val => isValidObjectId(val), {
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

/*  ID Param  */
const courseIdParamSchema = z.object({
  id: objectId("course")
});

module.exports = {
  createCourseSchema,
  updateCourseSchema,
  courseIdParamSchema
};