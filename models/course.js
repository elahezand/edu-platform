const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, unique: true, lowercase: true, trim: true },
        description: { type: String, required: true, trim: true },
        price: { type: Number, default: 0 },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
        instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        coverImage: { type: String, default: "" },
        isActive: { type: Boolean, default: true },
        rating: { type: Number, default: 0 },
        reviewsCount: { type: Number, default: 0 },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
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
