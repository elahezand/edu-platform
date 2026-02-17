const mongoose = require("mongoose");
const newsLetterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
  },
   {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: {
            virtuals: true,
            transform(doc, ret) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

const newsletterModel =
  mongoose.models.Newsletter || mongoose.model("Newsletter", newsLetterSchema);

module.exports = newsletterModel;
