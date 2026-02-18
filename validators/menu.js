const { z } = require("zod");

const createMenuSchema = z.object({
  title: z.string().min(1, "Title is required"),
  href: z.string().min(1, "Href is required"),
  parent: z.string().optional().nullable(),
});

const updateMenuSchema = createMenuSchema.partial()

module.exports = {
  createMenuSchema,
  updateMenuSchema,
};
