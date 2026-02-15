const { z } = require("zod");
const courseUserValidationSchema = z.object({
    course: z.string().refine(val => isValidObjectId(val), { message: "Invalid Course ID" }).optional(),
    user: z.string().refine(val => isValidObjectId(val), { message: "Invalid User ID" }).optional(),
    price: z.number().min(0, { message: "Price must be at least 0" }).optional()
});

module.exports = {
    courseUserValidationSchema
};
