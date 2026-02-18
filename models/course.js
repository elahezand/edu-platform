const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, unique: true, lowercase: true, trim: true, required: true },
        description: { type: String, required: true, trim: true },
        price: { type: Number, default: 0,required: true  },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
        instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        coverImage: { type: String, default: "", required: true },
        isActive: { type: Boolean, default: true, required: true },
        support: { type: String, default: "" },
        rating: { type: Number, default: 0},
        discount: { type: Number, default: 0 },
        reviewsCount: { type: Number, default: 0 },
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

// Virtual for sessions
courseSchema.virtual("sessions", {
    ref: "Session",
    localField: "_id",
    foreignField: "course",
    justOne: false
});

const courseModel =
    mongoose.models.Course || mongoose.model("Course", courseSchema);

module.exports = courseModel;
