const { z } = require("zod");

const createOffSchema = z.object({
  code: z.string().min(1, "Discount code is required"),
  percent: z
    .number({ invalid_type_error: "Percent must be a number" })
    .min(0, "Percent cannot be negative")
    .max(100, "Percent cannot exceed 100"),
  course: z.string().min(1, "Course ID is required"),
  max: z
    .number({ invalid_type_error: "Max usage must be a number" })
    .min(1, "Max usage must be at least 1"),
  uses: z
    .number({ invalid_type_error: "Uses must be a number" })
    .min(0, "Uses cannot be negative")
    .optional(),
  creator: z.string().min(1, "Creator ID is required"),
});

const updateOffSchema = createOffSchema.partial()



module.exports = {
  createOffSchema,
  updateOffSchema,
};
