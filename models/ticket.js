const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    departmentID: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Department",
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    parent: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "Ticket",
    },
    course: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "Course",
      default: "634e6b0e1d5142b91afa9bb3",
    },
    priority: {
      type: Number,
      required: true,
    },
    isAnswer: {
      type: Number,
      required: false,
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

const ticketModel =
  mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);

module.exports = ticketModel;

