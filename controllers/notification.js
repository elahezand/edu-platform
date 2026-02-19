const notificationModel = require("../models/notification");
const { createNotificationSchema } = require("../validators/notification");

// Get all notifications
exports.getAll = async (req, res, next) => {
    try {
        const notifications = await notificationModel
            .find({ admin: req.admin._id })
            .lean();

        res.status(200).json(notifications);
    } catch (err) {
        next(err);
    }
};

// Get one notification by ID
exports.get = async (req, res, next) => {
    try {
        const notification = await notificationModel.findById(req.params.id).populate("admin", "name email").lean();
        if (!notification) return res.status(404).json({ message: "Notification not found" });
        res.status(200).json(notification);
    } catch (err) {
        next(err);
    }
};

// Create a new notification
exports.post = async (req, res, next) => {
    try {
        const parsed = createNotificationSchema.safeParse(req.body);
        if (!parsed.success) return res.status(422).json({ message: parsed.error.errors });

        const newNotification = await notificationModel.create(parsed.data);
        res.status(201).json(newNotification);
    } catch (err) {
        next(err);
    }
};

// Update a notification
exports.seen = async (req, res, next) => {
  try {
    const updatedNotification = await notificationModel.findByIdAndUpdate(
      req.params.id,
      { $set: { see: 1 } },
      {
        new: true,            
        runValidators: true, 
      }
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(updatedNotification);
  } catch (err) {
    next(err);
  }
};

// Delete a notification
exports.remove = async (req, res, next) => {
    try {
        const deletedNotification = await notificationModel.findByIdAndDelete(req.params.id);
        if (!deletedNotification) return res.status(404).json({ message: "Notification not found" });
        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (err) {
        next(err);
    }
};
