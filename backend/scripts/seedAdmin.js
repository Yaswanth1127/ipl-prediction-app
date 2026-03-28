require("../config/env");
const connectDb = require("../config/db");
const env = require("../config/env");
const User = require("../models/User");
const { hashPassword } = require("../services/authService");

const seedAdmin = async () => {
  if (!env.adminEmails.length || !env.adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required to seed the admin user.");
  }

  await connectDb();

  const passwordHash = await hashPassword(env.adminPassword);

  for (const email of env.adminEmails) {
    const admin = await User.findOneAndUpdate(
      { email },
      {
        name: env.adminName,
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
