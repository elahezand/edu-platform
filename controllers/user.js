const { userValidationSchema } = require("../validators/user");
const { isValidObjectId } = require("mongoose");

const UserModel = require("../models/user");
const BanModel = require("../models/ban");
const { handleFileUpload } = require("../utils/serverFile")

const { paginate } = require("../utils/helper");

const {
    generateToken,
    generateRefreshToken,
    hashPassword,
    verifyPassword
} = require("../utils/auth");

const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
};

// =========================
// Get Users (Admin)
// =========================
exports.get = async (req, res, next) => {
    try {
        if (!req.admin)
            return next({ status: 403, message: "Forbidden" });

        const { searchParams } = new URL(
            req.protocol + "://" + req.get("host") + req.originalUrl
        );

        const useCursor = searchParams.has("cursor");

        const result = await paginate(
            UserModel,
            searchParams,
            {},
            "comments",
            useCursor,
            true
        );

        res.status(200).json({ users: result });

    } catch (err) {
        next(err);
    }
};

// =========================
// Create User (Admin)
// =========================
exports.post = async (req, res, next) => {
    try {
        if (!req.admin)
            return next({ status: 403, message: "Forbidden" });

        const parsed = userValidationSchema.safeParse(req.body);
        if (!parsed.success) {
            return next({
                status: 422,
                message: "Invalid data",
                errors: parsed.error.issues
            });
        }

        const { username, email, password, phone } = parsed.data;

        const isBanUser = await BanModel.findOne({ $or: [{ email }, { phone }] });
        if (isBanUser)
            return next({ status: 403, message: "User is banned" });

        const isUserExist = await UserModel.findOne({
            $or: [{ phone }, { email }, { username }]
        });

        if (isUserExist)
            return next({ status: 409, message: "User already exists" });

        const hashedPassword = await hashPassword(password);

        const usersCount = await UserModel.countDocuments();
        const role = usersCount < 3 ? "ADMIN" : "USER";

        const newUser = await UserModel.create({
            username,
            email: email || null,
            phone,
            password: hashedPassword,
            role
        });

        const payload = { id: newUser._id, email: newUser.email };

        const accessToken = await generateToken(payload);
        const refreshToken = await generateRefreshToken(payload);

        newUser.refreshToken = refreshToken;
        await newUser.save();

        res.cookie("token", accessToken, {
            ...cookieOptions,
            maxAge: 1000 * 60 * 60 * 24
        });

        res.cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        const newUserObject = newUser.toObject();
        delete newUserObject.password;
        delete newUserObject.refreshToken;

        res.status(201).json({
            message: "User created successfully",
            user: newUserObject
        });

    } catch (err) {
        next(err);
    }
};

// =========================
// Edit User (Admin)
// =========================
exports.edit = async (req, res, next) => {
    try {
        if (!req.user)
            return next({ status: 403, message: "Forbidden" });

        const { id } = req.params;
        if (!isValidObjectId(id))
            return next({ status: 422, message: "Invalid ID" });

        const formData = await req.formData()
        const body = Object.fromEntries(formData.entries());
        const parsed = userValidationSchema.safeParse(body);

        if (!parsed.success)
            return next({ status: 400, message: parsed.error.flatten().fieldErrors });

        const password = formData.get("password")
        const newPassword = formData.get("newPassword")
        const confirmPassword = formData.get("confirmPassword")

        const user = await UserModel.findById(id)
        if (!user) return next({ status: 404, message: "User Not Found" })

        const verifiedPassword = verifyPassword(password, user.password)

        if (!verifiedPassword) return next({ status: 422, message: "Current Password Not Valid" })

        if (newPassword && newPassword !== confirmPassword)
            return next({ status: 422, message: "Passwords Do Not Match" })

        let hashedPassword = user.password
        if (newPassword) hashedPassword = await hashPassword(newPassword)

        const avatar = await handleFileUpload(formData.get("avatar")) || "";

        await UserModel.findByIdAndUpdate(id, {
            $set: {
                ...parsed.data,
                avatar,
                password: hashedPassword
            }
        })
        return res.status(200).json({ message: "User Updated Successfully" })
    } catch (err) {
        next(err);
    }
};

// =========================
// Delete User (Admin)
// =========================
exports.deleteUser = async (req, res, next) => {
    try {
        if (!req.admin)
            return next({ status: 403, message: "Forbidden" });

        const { id } = req.params;
        if (!isValidObjectId(id))
            return next({ status: 422, message: "Invalid ID" });

        await UserModel.findByIdAndDelete(id);

        res.status(200).json({
            message: "User removed successfully"
        });

    } catch (err) {
        next(err);
    }
};

// =========================
// Ban User (Admin)
// =========================
exports.ban = async (req, res, next) => {
    try {
        if (!req.admin)
            return next({ status: 403, message: "Forbidden" });

        const { user, email, phone } = req.body;

        const exists = await BanModel.findOne({ user });
        if (!exists) {
            await BanModel.create({ user, email, phone });
        }

        await UserModel.findOneAndDelete({
            $or: [{ _id: user }, { phone }]
        });

        res.status(200).json({
            message: "User banned successfully"
        });

    } catch (err) {
        next(err);
    }
};

// =========================
// Toggle Role (Admin)
// =========================
exports.role = async (req, res, next) => {
    try {
        if (!req.admin)
            return next({ status: 403, message: "Forbidden" });

        const { id } = req.params;

        const user = await UserModel.findById(id);
        if (!user)
            return next({ status: 404, message: "User not found" });

        const newRole = user.role === "USER" ? "ADMIN" : "USER";

        user.role = newRole;
        await user.save();

        res.status(200).json({
            message: "Role updated"
        });

    } catch (err) {
        next(err);
    }
};
