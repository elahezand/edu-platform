const { z } = require("zod");
const { isValidObjectId } = require("mongoose");

/* ---------- helpers ---------- */
const objectId = (field) =>
  z.string().refine(val => isValidObjectId(val), {
    message: `Invalid ${field} ID`,
  });


const createNotificationSchema = z.object({
    msg: z.string().min(1, "Message is required"),
    admin: z.string().optional(),
    see: z.number().optional(),
});

const updateNotificationSchema = createNotificationSchema.partial();
/* ---------- ID Param ---------- */
const notificationIdParamSchema = z.object({
  id: objectId("contact"),
});


module.exports = {
    createNotificationSchema,
    updateNotificationSchema,
    notificationIdParamSchema
};
