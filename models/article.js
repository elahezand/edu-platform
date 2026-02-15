const mongoose = require("mongoose");
const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        cover: {
            type: String,
            required: false,
        },
        shortName: {
            type: String,
            required: true,
            unique: true,
        },

        categoryID: {
            type: mongoose.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        creator: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        publish: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        }
    }
);
const articleModel = mongoose.models.Article || mongoose.model("Article", articleSchema)

module.exports = articleModel;
