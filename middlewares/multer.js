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
    const targetField = file.fieldname === "cover" ? "articleCover" : file.fieldname;
    
    if (paths[targetField]) {
      cb(null, paths[targetField]);
    } else {
      cb(new Error(`No path defined for field: ${file.fieldname}`), false);
    }
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = {
    coverImage: "image/",
    avatar: "image/",
    cover: "image/",     
    articleCover: "image/",
    videoUrl: "video/"
  };

  const expectedType = allowedMimeTypes[file.fieldname];

  if (expectedType && file.mimetype.startsWith(expectedType)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}. Expected ${expectedType}`), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
  }
});

module.exports = upload;