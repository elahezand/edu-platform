const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    parent: {
      type: mongoose.Types.ObjectId,
      ref: "Department",
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);


const departmentmodel =
  mongoose.models.Department || mongoose.model("Department", schema);

module.exports = departmentmodel;
