const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/User");
const {
  hashPassword,
  comparePassword,
  createToken,
  serializeUser,
  getRoleForEmail,
  verifyGoogleToken,
} = require("../services/authService");

const createAuthResponse = (user) => ({
  token: createToken(user),
  user: serializeUser(user),
});

const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    passwordHash: await hashPassword(password),
    role: getRoleForEmail(normalizedEmail),
  });

  res.status(201).json(createAuthResponse(user));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user || !user.passwordHash) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const nextRole = getRoleForEmail(normalizedEmail);

  if (user.role !== nextRole) {
    user.role = nextRole;
    await user.save();
  }

  res.json(createAuthResponse(user));
});

const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: "Google credential is required." });
  }

  const payload = await verifyGoogleToken(credential);
  const email = String(payload.email || "").trim().toLowerCase();

  if (!email) {
    return res.status(400).json({ message: "Google account email is missing." });
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name: payload.name || email.split("@")[0],
      email,
      role: getRoleForEmail(email),
      providers: {
        googleId: payload.sub,
      },
    });
  } else {
    user.role = getRoleForEmail(email);

    if (user.providers?.googleId !== payload.sub) {
      user.providers = {
        ...(user.providers?.toObject ? user.providers.toObject() : user.providers || {}),
        googleId: payload.sub,
      };
    }

    await user.save();
  }

  res.json(createAuthResponse(user));
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: serializeUser(req.user) });
});

module.exports = {
  signup,
  login,
  googleLogin,
  me,
};
