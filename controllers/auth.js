const { userValidationSchema } = require("../validators/user");
const UserModel = require("../models/user");
const BanModel = require("../models/ban");
const z = require("zod");

const {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashPassword,
  verifyPassword
} = require("../utils/auth");

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production"
};

// =========================
// SIGNUP
// =========================
exports.signup = async (req, res, next) => {
  try {
    const parsed = userValidationSchema.safeParse(req.body);
    if (!parsed.success) {
      return next({ status: 422, message: "Invalid data", errors: parsed.error.issues });
    }

    const { username, email, password, phone } = parsed.data;

    const isBanUser = await BanModel.findOne({
      $or: [{ email }, { phone }]
    });
    if (isBanUser)
      return next({ status: 403, message: "Registration not allowed" });

    const existingUser = await UserModel.findOne({
      $or: [{ phone }, { email }, { username }]
    });
    if (existingUser)
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

    const userObj = newUser.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    res.status(201).json({
      message: "Registered successfully",
      user: userObj
    });

  } catch (err) {
    next(err);
  }
};

// =========================
// SIGNIN
// =========================
const signinSchema = z.object({
  identifier: z.string(),
  password: z.string().min(6)
});

exports.signin = async (req, res, next) => {
  try {
    const parsed = signinSchema.safeParse(req.body);
    if (!parsed.success) {
      return next({ status: 422, message: "Invalid data", errors: parsed.error.issues });
    }

    const { identifier, password } = parsed.data;

    const isBanUser = await BanModel.findOne({
      $or: [{ email: identifier }, { phone: identifier }]
    });
    if (isBanUser)
      return next({ status: 403, message: "Login not allowed" });

    const user = await UserModel.findOne({
      $or: [{ phone: identifier }, { email: identifier }]
    });
    if (!user)
      return next({ status: 401, message: "User not found" });

    const validPassword = await verifyPassword(password, user.password);
    if (!validPassword)
      return next({ status: 401, message: "Password not valid" });

    const payload = {
      id: user._id,
      email: user.email || `${user.phone}@app.local`
    };

    const accessToken = await generateToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("token", accessToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    res.status(200).json({
      message: "Login successfully",
      user: userObj
    });

  } catch (err) {
    next(err);
  }
};

// =========================
// GET ME
// =========================
exports.getMe = async (req, res, next) => {
  try {
    if (!req.user)
      return next({ status: 401, message: "Unauthorized" });

    const isBanUser = await BanModel.findOne({
      $or: [{ email: req.user.email }, { phone: req.user.phone }]
    });
    if (isBanUser)
      return next({ status: 403, message: "Access denied" });

    const userObj = req.user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    res.status(200).json({ user: userObj });

  } catch (err) {
    next(err);
  }
};

// =========================
// LOGOUT
// =========================
exports.logout = async (req, res, next) => {
  try {
    if (req.user) {
      await UserModel.updateOne(
        { _id: req.user._id },
        { $unset: { refreshToken: 1 } }
      );
    }

    res.clearCookie("token", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    res.status(200).json({ message: "Logged out successfully" });

  } catch (err) {
    next(err);
  }
};

// =========================
// REFRESH TOKEN
// =========================
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return next({ status: 401, message: "Unauthorized" });

    const user = await UserModel.findOne({ refreshToken });
    if (!user)
      return next({ status: 401, message: "Unauthorized" });

    const payload = await verifyRefreshToken(refreshToken);
    if (!payload)
      return next({ status: 401, message: "Expired token" });

    const newAccessToken = await generateToken({
      id: user._id,
      email: payload.email
    });

    const newRefreshToken = await generateRefreshToken({
      id: user._id,
      email: payload.email
    });

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("token", newAccessToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24
    });

    res.cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    res.status(200).json({ message: "Token refreshed successfully" });

  } catch (err) {
    next(err);
  }
};
