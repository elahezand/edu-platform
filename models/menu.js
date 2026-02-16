const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    href: {
      type: String,
      required: true,
    },
    parent: {
      type: mongoose.Types.ObjectId,
      ref: "Menu",
      default: null,
    },
  },
  { timestamps: true }
);


const menuModel =
  mongoose.models.Menu || mongoose.model("Menu", schema);

module.exports = menuModel;
