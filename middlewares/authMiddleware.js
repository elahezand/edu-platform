const UserModel = require("../models/user");
const { verifyToken } = require("../utils/auth");

const getToken = (req) =>
  req.cookies?.token || req.headers.authorization?.split(" ")[1] || null;

const identifyUser = async (req, res, next) => {
  try {
    const token = getToken(req);
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const payload = await verifyToken(token);
    if (!payload) return res.status(401).json({ status: "expired" });

    const user = await UserModel.findOne({ email: payload.email }).select("_id role email");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Auth error" });
  }
};

const authAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN")
    return res.status(403).json({ message: "Access denied" });
  next();
};

module.exports = {
  identifyUser,
  authAdmin,
};