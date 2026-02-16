const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    msg: {
      type: String,
      required: true,
    },
    admin: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: false,
    },
    see: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const notificationModel = mongoose.model("Notification", notificationSchema);

module.exports = notificationModel;
