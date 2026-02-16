const { z } = require("zod");

/* ========= Helpers ========= */

const phoneSchema = z
  .string()
  .trim()
  .regex(/^(\+?\d{10,15})$/, "Invalid phone number");

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address");

const urlOptional = z
  .string()
  .trim()
  .url("Invalid URL")
  .optional()
  .or(z.literal(""));

/* ========= Create ========= */

const createInfoSchema = z.object({
  phone: phoneSchema,
  email: emailSchema,
  logo: z.string().trim().min(1, "Logo is required"),

  address: z.string().trim().optional().or(z.literal("")),

  socials: z
    .object({
      instagram: urlOptional,
      telegram: urlOptional,
      linkedin: urlOptional,
    })
    .optional(),
});

/* ========= Update ========= */

const updateInfoSchema = z.object({
  phone: phoneSchema.optional(),
  email: emailSchema.optional(),
  logo: z.string().trim().min(1).optional(),

  address: z.string().trim().optional().or(z.literal("")),

  socials: z
    .object({
      instagram: urlOptional,
      telegram: urlOptional,
      linkedin: urlOptional,
    })
    .optional(),
});

/* ========= Params ========= */

const infoIdParamSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

module.exports = {
  createInfoSchema,
  updateInfoSchema,
  infoIdParamSchema,
};
