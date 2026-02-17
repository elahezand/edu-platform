const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    videoUrl: {
      type: String,
      required: true
    },

    duration: {
      type: Number, // seconds
      required: true
    },

    order: {
      type: Number,
      required: true
    },

    isFree: {
      type: Boolean,
      default: false
    }
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

const sessionModel =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);

module.exports = sessionModel;
