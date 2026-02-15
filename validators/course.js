const { z } = require("zod");
const { isValidObjectId } = require("mongoose");

/* ---------- helpers ---------- */
const objectId = (field) =>
  z.string().refine(val => isValidObjectId(val), {
    message: `Invalid ${field} ID`,
  });

/* ---------- Create Course ---------- */
const createCourseSchema = z.object({
  title: z.string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters"),
  
  description: z.string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters"),
  
  price: z.number()
    .nonnegative()
    .optional(),
  
  category: objectId("category"),
  instructor: objectId("instructor"),
  
  coverImage: z.string()
    .url("Cover image must be a valid URL")
    .optional(),
  
  isActive: z.boolean()
    .optional()
});

/* ---------- Update Course ---------- */
const updateCourseSchema = z.object({
  title: z.string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters")
    .optional(),

  description: z.string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),
  
  price: z.number()
    .nonnegative()
    .optional(),
  
  category: objectId("category").optional(),
  instructor: objectId("instructor").optional(),
  
  coverImage: z.string()
    .url("Cover image must be a valid URL")
    .optional(),
  
  isActive: z.boolean()
    .optional()
});

/* ---------- ID Param ---------- */
const courseIdParamSchema = z.object({
  id: objectId("course")
});

/* ---------- export ---------- */
module.exports = {
  createCourseSchema,
  updateCourseSchema,
  courseIdParamSchema
};
