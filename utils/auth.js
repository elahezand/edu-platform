const { hash, compare } = require("bcryptjs");
const { sign, verify } = require("jsonwebtoken");

const hashPassword = (password) => {
  return hash(password, 12);
};

const verifyPassword = (password, hashedPassword) => {
  return compare(password, hashedPassword);
};

const generateToken = (data) => {
  return sign({ ...data }, process.env.privateKey, {
    algorithm: "HS256",
    expiresIn: "60s",
  });
};

const verifyToken = (token) => {
  try {
    return verify(token, process.env.privateKey);
  } catch {
    return null;
  }
};

const generateRefreshToken = (data) => {
  return sign({ ...data }, process.env.REFRESH_TOKEN, {
    algorithm: "HS256",
    expiresIn: "15d",
  });
};

const verifyRefreshToken = (refreshToken) => {
  try {
    return verify(refreshToken, process.env.REFRESH_TOKEN);
  } catch {
    return null;
  }
};

const getMe = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.json(null);

    const payloadToken = await verifyRefreshToken(token);
    if (!payloadToken) return res.json(null);

    const user = await UserModel.findOne({ email: payloadToken.email });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  generateRefreshToken,
  verifyRefreshToken,
  getMe
};
