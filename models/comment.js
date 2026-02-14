const mongoose = require("mongoose")
const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    isAccept: {
      type: Boolean,
      default: false,
    },

    body: {
      type: String,
      required: [true, "Comment text is required"],
      minlength: 3,
      maxlength: 1000,
      trim: true,
    },

    answers: [
      {
        text: {
          type: String,
          required: true,
          trim: true,
        },
        admin: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
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

const CommentModel =
  mongoose.models.Comment || mongoose.model("Comment", schema);

module.exports = CommentModel;
