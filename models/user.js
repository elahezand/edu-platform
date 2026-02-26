const mongoose = require("mongoose")
const schema = new mongoose.Schema(
    {
        username: {
            type: String,
            default: "User Sabz Learn",
            trim: true,
            minlength: 3,
            maxlength: 30,
        },

        phone: {
            type: String,
            required: [true, "Phone number is required"],
            unique: true,
        },

        email: {
            type: String,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            minlength: 6,
            select: false,
        },

        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER",
        },

        avatar: {
            type: String,
        },

        refreshToken: {
            type: String,
            select: false,
        },

        resetCode: {
            type: String,
            select: false,
        },

        resetCodeExpire: {
            type: Date,
        },
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete ret.password;
                delete ret.refreshToken;
                delete ret.__v;
                return ret;
            },
        },
    }
);

// relation
schema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "userID",
});

const UserModel =
    mongoose.models.User || mongoose.model("User", schema);

module.exports = UserModel;
