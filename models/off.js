const mongoose = require("mongoose");

const offSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Discount code is required"],
      trim: true,
      unique: true,
    },
    percent: {
      type: Number,
      required: [true, "Discount percent is required"],
      min: [0, "Percent cannot be negative"],
      max: [100, "Percent cannot exceed 100"],
    },
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: [true, "Course reference is required"],
    },
    max: {
      type: Number,
      required: [true, "Max usage is required"],
      min: [1, "Max usage must be at least 1"],
    },
    uses: {
      type: Number,
      default: 0, 
      min: [0, "Uses cannot be negative"],
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Creator reference is required"],
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


const offModel =
  mongoose.models.Off || mongoose.model("Off", offSchema);

module.exports = offModel;
