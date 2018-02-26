const path = require("path");

module.exports = {
  debug: process.env.NODE_ENV !== "production",
  port: process.env.PORT || 9999,
  folders: {
    resource: path.resolve(
      __dirname,
      "..",
      process.env.FOLDER_RESOURCE || "resource"
    ),
    cache: path.resolve(__dirname, "..", process.env.FOLDER_CACHE || "cache"),
    static: path.resolve(__dirname, "..", process.env.FOLDER_STATIC || "static")
  },
  uploadLimits: {
    fields: Number(process.env.UPLOAD_MAX_FIELD) || 17,
    files: Number(process.env.UPLOAD_MAX_FILE) || 17,
    fileSize: Number(process.env.UPLOAD_MAX_SIZE || 100) * 1048576,
    parts: Number(process.env.UPLOAD_MAX_PART) || 17
  },
  allowTypes: process.env.ALLOW_TYPES
    ? process.env.ALLOW_TYPES.split(",").map(org => org.trim())
    : [],
  allowHosts: process.env.ALLOW_HOSTS
    ? process.env.ALLOW_HOSTS.split(",").map(org => org.trim())
    : [],
  domain: process.env.DOMAIN,
  auth: {
    username: process.env.AUTH_USER,
    password: process.env.AUTH_PASSOWRD,
    secreteKey: process.env.AUTH_SECRET_KEY,
  }
};
