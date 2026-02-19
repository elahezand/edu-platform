const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    isAnswer: {
      type: Boolean,
      default: false,
    },
    body: {
      type: String,
      required: [true, "Message body is required"],
      minlength: 3,
      maxlength: 2000,
      trim: true,
    },
  },
  {
    timestamps: true,
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

const contactModel = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

module.exports = contactModel;
