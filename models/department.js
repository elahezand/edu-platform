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


const departmentmodel =
  mongoose.models.Department || mongoose.model("Department", schema);

module.exports = departmentmodel;
