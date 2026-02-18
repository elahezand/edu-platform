const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    logo: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    socials: {
      instagram: { type: String, trim: true, default: "" },
      telegram: { type: String, trim: true, default: "" },
      linkedin: { type: String, trim: true, default: "" },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

schema.index({ email: 1 }, { unique: true });


const infoModel =
  mongoose.models.Info || mongoose.model("Info", schema);

module.exports = infoModel;
