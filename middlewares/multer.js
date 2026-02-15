const multer = require("multer");
const path = require("path");
const fs = require("fs");

const paths = {
  coverImage: path.join(__dirname, "..", "public", "courses", "covers"),
  videoUrl: path.join(__dirname, "..", "public", "sessions", "videos"),
  avatar: path.join(__dirname, "..", "public", "users", "avatars"),
  articleCover: path.join(__dirname, "..", "public", "articles", "covers"),

};

Object.values(paths).forEach(p => {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (paths[file.fieldname]) {
      cb(null, paths[file.fieldname]);
    } else {
      cb(new Error("Unknown field"), false);
    }
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "coverImage" && file.mimetype.startsWith("image/")) {
    return cb(null, true);
  }

  if (file.fieldname === "avatar" && file.mimetype.startsWith("image/")) {
    return cb(null, true);
  }

  if (file.fieldname === "videoUrl" && file.mimetype.startsWith("video/")) {
    return cb(null, true);
  }
  if (file.fieldname === "cover" && file.mimetype.startsWith("video/")) {
    return cb(null, true);
  }
  cb(new Error(`Invalid file type for ${file.fieldname}`), false);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
