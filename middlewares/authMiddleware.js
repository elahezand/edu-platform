const UserModel = require("../models/user");
const { verifyToken } = require("../utils/auth");

const getToken = (req) => {
  return req.cookies?.token || req.headers.authorization?.split(" ")[1] || null;
};

const authUser = async (req, res, next) => {
  try {
    const token = getToken(req);
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const payloadToken = await verifyToken(token);
    if (!payloadToken) return res.status(401).json({ status: "expired" });

    const user = await UserModel.findOne({ email: payloadToken.email });
    req.user = user || null;

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Auth error" });
  }
};

const authAdmin = async (req, res, next) => {
  try {
    const token = getToken(req);
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const payloadToken = await verifyToken(token);
    if (!payloadToken) return res.status(401).json({ status: "expired" });

    const admin = await UserModel.findOne({ email: payloadToken.email });
    if (!admin) return res.status(404).json({ message: "User not found" });

    if (admin.role !== "ADMIN")
      return res.status(403).json({ message: "Access denied" });

    req.admin = admin || null;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Auth error" });
  }
};


module.exports = {
  authUser,
  authAdmin,
};
