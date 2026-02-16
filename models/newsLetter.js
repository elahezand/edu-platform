const mongoose = require("mongoose");
const newsLetterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const newsletterModel =
  mongoose.models.Newsletter || mongoose.model("Newsletter", newsLetterSchema);

module.exports = newsletterModel;
