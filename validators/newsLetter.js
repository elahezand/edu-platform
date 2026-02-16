const { z } = require("zod");

// ==============================
// Zod validation
// ==============================
const createNewsletterSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

module.exports = {
createNewsletterSchema
};
