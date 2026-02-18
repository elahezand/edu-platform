const { z } = require("zod");
const mongoose = require("mongoose");

const objectId = z.string().refine(
  (val) => mongoose.Types.ObjectId.isValid(val),
  { message: "Invalid ID" }
);

const createDepartmentSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
});

const updateDepartmentSchema = z.object({
  id: objectId,
  title: z.string().min(2).optional(),
});


module.exports = {
  createDepartmentSchema,
  updateDepartmentSchema,
};
