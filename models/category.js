const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
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


const categoryModel =
    mongoose.models.Category || mongoose.model("Category", categorySchema);

module.exports = categoryModel;
