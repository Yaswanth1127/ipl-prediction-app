const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const env = require("../config/env");

const googleClient = new OAuth2Client(env.googleClientId || undefined);

const hashPassword = (password) => bcrypt.hash(password, 10);

const comparePassword = (password, passwordHash) => bcrypt.compare(password, passwordHash);

const createToken = (user) =>
  jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  providers: {
    googleId: user.providers?.googleId ? "linked" : null,
  },
});

const getRoleForEmail = (email) =>
  env.adminEmails.includes(String(email || "").trim().toLowerCase()) ? "admin" : "user";

const toTitleCase = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const deriveNameFromEmail = (email) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const localPart = normalizedEmail.split("@")[0] || "";
  const specialNameMap = {
    "srikarambula.1924@gmail.com": "Srikar",
  };

  if (specialNameMap[normalizedEmail]) {
    return specialNameMap[normalizedEmail];
  }

  const readable = localPart
    .replace(/[0-9]+/g, " ")
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return toTitleCase(readable || localPart || "Admin");
};

const getAdminDisplayName = (email) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const emailIndex = env.adminEmails.indexOf(normalizedEmail);

  if (emailIndex >= 0 && env.adminNames[emailIndex]) {
    return env.adminNames[emailIndex];
  }

  return deriveNameFromEmail(normalizedEmail);
};

const verifyGoogleToken = async (credential) => {
  if (!env.googleClientId) {
    const error = new Error("Google sign-in is not configured.");
    error.statusCode = 400;
    throw error;
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.googleClientId,
  });

  return ticket.getPayload();
};

module.exports = {
  hashPassword,
  comparePassword,
  createToken,
  serializeUser,
  getRoleForEmail,
  getAdminDisplayName,
  verifyGoogleToken,
};
