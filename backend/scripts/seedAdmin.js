require("../config/env");
const connectDb = require("../config/db");
const env = require("../config/env");
const User = require("../models/User");
const { hashPassword } = require("../services/authService");

const seedAdmin = async () => {
  if (!env.adminEmail || !env.adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required to seed the admin user.");
  }

  await connectDb();

  const passwordHash = await hashPassword(env.adminPassword);

  const admin = await User.findOneAndUpdate(
    { email: env.adminEmail.toLowerCase() },
    {
      name: env.adminName,
      email: env.adminEmail.toLowerCase(),
      passwordHash,
      role: "admin",
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  console.log(`Admin ready: ${admin.email}`);
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
