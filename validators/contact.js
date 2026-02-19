const { z } = require("zod");
/*  Create Contact  */
const createContactSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string()
    .trim()
    .email("Invalid email address"),
  phone: z.string()
    .trim()
    .min(5, "Phone number is too short")
    .max(20, "Phone number is too long")
    .regex(/^[0-9+\-()\s]+$/, "Invalid phone number format"),
  body: z.string()
    .trim()
    .min(1, "Message body is required")
    .max(2000, "Message is too long"),
  isAnswer: z.boolean().default(false),
});



/*  export  */
module.exports = {
  createContactSchema,
};
