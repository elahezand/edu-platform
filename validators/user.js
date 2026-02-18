const { z } = require("zod");

/*  Create User  */
const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(40, "Name cannot exceed 40 characters")
    .refine(val => /^[a-zA-Z\u0600-\u06FF\s]+$/.test(val), "Name must only contain letters"),

  email: z.string().email("Invalid email format"),

  phone: z
    .string()
    .length(11, "Phone number must be exactly 11 digits")
    .regex(/^09\d{9}$/, "Invalid Iranian phone number format"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine(val => /[A-Z]/.test(val), "At least one uppercase letter is required")
    .refine(val => /[a-z]/.test(val), "At least one lowercase letter is required")
    .refine(val => /[0-9]/.test(val), "At least one number is required")
    .refine(val => /[#?!@$%^&*\-]/.test(val), "At least one special character is required"),

  confirmPassword: z.string(),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });
  }
});

/*  Update User  */
const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(40, "Name cannot exceed 40 characters")
    .refine(val => /^[a-zA-Z\u0600-\u06FF\s]+$/.test(val), "Name must only contain letters")
    .optional(),

  email: z.string().email("Invalid email format").optional(),

  phone: z
    .string()
    .length(11, "Phone number must be exactly 11 digits")
    .regex(/^09\d{9}$/, "Invalid Iranian phone number format")
    .optional(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine(val => /[A-Z]/.test(val), "At least one uppercase letter is required")
    .refine(val => /[a-z]/.test(val), "At least one lowercase letter is required")
    .refine(val => /[0-9]/.test(val), "At least one number is required")
    .refine(val => /[#?!@$%^&*\-]/.test(val), "At least one special character is required")
    .optional(),

  confirmPassword: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.password && data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });
  }
});


/*  export  */
module.exports = {
  createUserSchema,
  updateUserSchema,
};
