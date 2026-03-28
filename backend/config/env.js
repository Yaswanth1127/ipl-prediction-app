const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const normalizeOrigin = (value) => String(value || "").trim().replace(/\/+$/, "");

const clientOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || "",
  jwtSecret: process.env.JWT_SECRET || "change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: clientOrigins[0] || "http://localhost:5173",
  clientOrigins,
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  adminName: process.env.ADMIN_NAME || "League Admin",
  adminEmailsRaw: process.env.ADMIN_EMAIL || "",
  adminEmails: (process.env.ADMIN_EMAIL || "")
    .split(",")
    .map((email) => String(email || "").trim().toLowerCase())
    .filter(Boolean),
  adminNames: (process.env.ADMIN_NAMES || "")
    .split(",")
    .map((name) => String(name || "").trim())
    .filter(Boolean),
  adminPassword: process.env.ADMIN_PASSWORD || "",
};
