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
    { timestamps: true }
);


const categoryModel =
    mongoose.models.Category || mongoose.model("Category", categorySchema);

module.exports = categoryModel;
