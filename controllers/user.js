const UserModel = require("../models/user");
const BanModel = require("../models/ban");
const mongoose = require("mongoose")
const { paginate } = require("../utils/helper");
const { generateToken, generateRefreshToken, hashPassword, verifyPassword } = require("../utils/auth");

const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
};

/*  Get Users (Admin)*/
exports.get = async (req, res, next) => {
    try {
        const searchParams = new URLSearchParams(req.query);
        const useCursor = searchParams.has("cursor");

        const result = await paginate(UserModel, searchParams, {}, "comments", useCursor, true);

        res.status(200).json({ users: result });
    } catch (err) {
        next(err);
    }
};

/* Create User (Admin)*/
exports.post = async (req, res, next) => {
    try {

        const { username, email, password, phone } = req.parsed.data;

        const isBanUser = await BanModel.findOne({ $or: [{ email }, { phone }] });
        if (isBanUser) return next({ status: 403, message: "User is banned" });

        const isUserExist = await UserModel.findOne({ $or: [{ phone }, { email }, { username }] });
        if (isUserExist) return next({ status: 409, message: "User already exists" });

        const hashedPassword = await hashPassword(password);
        const usersCount = await UserModel.countDocuments();
        const role = usersCount < 3 ? "ADMIN" : "USER";

        const newUser = await UserModel.create({
            username,
            email,
            phone,
            password: hashedPassword,
            role
        });

        const payload = { id: newUser._id, email: newUser.email };
        const accessToken = await generateToken(payload);
        const refreshToken = await generateRefreshToken(payload);

        newUser.refreshToken = refreshToken;
        await newUser.save();

        res.cookie("token", accessToken, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 24 });
        res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 7 });

        const userObj = newUser.toObject();
        delete userObj.password;
        delete userObj.refreshToken;

        res.status(201).json({ message: "User created successfully", user: userObj });
    } catch (err) {
        next(err);
    }
};

/* Update User (Admin/User)*/
exports.put = async (req, res, next) => {
    try {
        const { password, newPassword, confirmPassword, ...rest } = req.parsed.data;

        const user = await UserModel.findById(req.params.id);
        if (!user) return next({ status: 404, message: "User not found" });

        if (req.user._id.toString() !== req.params.id) {
            return next({ status: 403, message: "Access denied" });
        }

        if (newPassword) {
            if (!password || !verifyPassword(password, user.password)) {
                return next({ status: 422, message: "Current password is invalid" });
            }
            if (newPassword !== confirmPassword) {
                return next({ status: 422, message: "Passwords do not match" });
            }
            rest.password = await hashPassword(newPassword);
        }

        if (req.file) {
            rest.avatar = `/users/avatars/${req.file.filename}`;
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.id
            , { $set: rest }, { new: true });

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (err) {
        next(err);
    }
};

/* Delete User (Admin)*/
exports.remove = async (req, res, next) => {
    try {
        await UserModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User removed successfully" });
    } catch (err) {
        next(err);
    }
};

/* Ban User (Admin)*/
exports.ban = async (req, res, next) => {
    try {
        const userId = req.body.user ? String(req.body.user) : null;
        const email = req.body.email ? String(req.body.email) : null;
        const phone = req.body.phone ? String(req.body.phone) : null;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid or missing User ID" });
        }
        const exists = await BanModel.findOne({ user: userId }).lean();
        if (!exists) {
            await BanModel.create({
                user: userId,
                email,
                phone
            });
        }
        return res.status(200).json({ message: "User banned successfully" });
    } catch (err) {
        next(err);
    }
};

/* Toggle Role (Admin)*/
exports.toggleRole = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) return next({ status: 404, message: "User not found" });

        user.role = user.role === "USER" ? "ADMIN" : "USER";
        await user.save();

        res.status(200).json({ message: "Role updated", role: user.role });
    } catch (err) {
        next(err);
    }
};
