const { writeFile, mkdir } = require("fs/promises");
const path = require("path");

async function handleFileUpload(file) {
  if (!file || file.size === 0) return null;

  await mkdir(path.join(process.cwd(), "public", "uploads"), { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = Date.now() + "_" + file.name;
  const filePath = path.join(process.cwd(), "public", "uploads", filename);

  await writeFile(filePath, buffer);

  return `/uploads/${filename}`;
}

module.exports = handleFileUpload;
