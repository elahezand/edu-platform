const notificationModel = require("../models/notification");
const { createNotificationSchema, notificationIdParamSchema, updateNotificationSchema } = require("../validators/notification");

// Get all notifications
exports.getAll = async (req, res, next) => {
    try {
        if (!req.admin)
            return next({ status: 403, message: "Forbidden" });

        const notifications = await notificationModel.find().populate("admin", "name email").lean();
        res.status(200).json(notifications);
    } catch (err) {
        next(err);
    }
};

// Get one notification by ID
exports.getOne = async (req, res, next) => {
    try {
        if (!req.admin)
            return next({ status: 403, message: "Forbidden" });
        const parsedId = notificationIdParamSchema.safeParse(req.params);
        if (!parsedId.success)
            return next({ status: 422, message: "Invalid ID" });


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
        if (!req.admin)
            return next({ status: 403, message: "Forbidden" });

        const parsed = createNotificationSchema.safeParse(req.body);
        if (!parsed.success) return res.status(422).json({ message: parsed.error.errors });

        const newNotification = await notificationModel.create(parsed.data);
        res.status(201).json(newNotification);
    } catch (err) {
        next(err);
    }
};

// Update a notification
exports.patch = async (req, res, next) => {
    try {
        if (!req.admin)
            return next({ status: 403, message: "Forbidden" });
       
        const parsedId = notificationIdParamSchema.safeParse(req.params);
        if (!parsedId.success)
            return next({ status: 422, message: "Invalid ID" });


        const parsed = createNotificationSchema.partial().safeParse(req.body);
        if (!parsed.success) return res.status(422).json({ message: parsed.error.errors });

        const updatedNotification = await notificationModel.findByIdAndUpdate(
            req.params.id,
            { $set: parsed.data },
            { new: true }
        );

        if (!updatedNotification) return res.status(404).json({ message: "Notification not found" });

        res.status(200).json(updatedNotification);
    } catch (err) {
        next(err);
    }
};

// Delete a notification
exports.remove = async (req, res, next) => {
    try {
        if (!req.admin)
            return next({ status: 403, message: "Forbidden" });
        const parsedId = notificationIdParamSchema.safeParse(req.params);
        if (!parsedId.success)
            return next({ status: 422, message: "Invalid ID" });


        const deletedNotification = await notificationModel.findByIdAndDelete(req.params.id);
        if (!deletedNotification) return res.status(404).json({ message: "Notification not found" });
        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (err) {
        next(err);
    }
};
