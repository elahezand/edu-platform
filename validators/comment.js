const { z } = require("zod");
const mongoose = require("mongoose");

const objectId = (field = "ID") =>
  z.string().trim().refine(val => mongoose.Types.ObjectId.isValid(val), {
    message: `Invalid ${field} ID`,
  });

/*  Create Comment (User)  */
const createCommentSchema = z.object({
  course: objectId("course"),
  score: z.number()
    .int("Score must be an integer")
    .min(1, "Score must be at least 1")
    .max(5, "Score cannot exceed 5"),
  body: z.string()
    .trim()
    .min(3, "Comment must be at least 3 characters")
    .max(1000, "Comment cannot exceed 1000 characters"),
});

/*  Answer Comment (Admin)  */
const answerCommentSchema = z.object({
  text: z.string()
    .trim()
    .min(1, "Answer text is required")
    .max(1000, "Answer is too long"),
});

/*  Update Comment Body (Admin)  */
const updateCommentSchema = z.object({
  body: z.string()
    .trim()
    .min(3, "Comment must be at least 3 characters")
    .max(1000, "Comment cannot exceed 1000 characters"),
});

module.exports = {
  createCommentSchema,
  answerCommentSchema,
  updateCommentSchema,
};
