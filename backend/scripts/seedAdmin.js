require("../config/env");
const connectDb = require("../config/db");
const env = require("../config/env");
const User = require("../models/User");
const { hashPassword, getAdminDisplayName } = require("../services/authService");

const seedAdmin = async () => {
  if (!env.adminEmails.length || !env.adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required to seed the admin user.");
  }

  await connectDb();

  const passwordHash = await hashPassword(env.adminPassword);

  for (const email of env.adminEmails) {
    const existingUser = await User.findOne({ email });
    const nextName =
      existingUser?.name && existingUser.name !== env.adminName ? existingUser.name : getAdminDisplayName(email);

    const admin = await User.findOneAndUpdate(
      { email },
      {
        name: nextName,
        email,
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
  }

  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
