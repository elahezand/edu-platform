const mongoose = require("mongoose")
const UserModel = require("./user")

const schema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "USER",
        required: true
    },

    phone: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    }
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


const BanModel = mongoose.models.Ban || mongoose.model("Ban", schema)

module.exports = BanModel;
