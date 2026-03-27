const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

// Mock Schema if needed, but easier to just use the existing one if possible
// Since ES modules vs CommonJS might be an issue, I'll define a simple schema here for seeding
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  role: { type: String, default: "user" }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seedUsers() {
  console.log("🔍 Starting Database Seeding...");

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clean up existing test users if they exist
    await User.deleteMany({ email: { $in: ["admin@artisan.com", "user@artisan.com"] } });
    console.log("🗑️ Cleaned up existing test users");

    // Create Admin
    const adminPassword = "AdminPass123";
    const adminHash = await bcrypt.hash(adminPassword, 12);
    await User.create({
      name: "System Admin",
      email: "admin@artisan.com",
      passwordHash: adminHash,
      role: "admin"
    });
    console.log(`👤 Admin created: admin@artisan.com / ${adminPassword}`);

    // Create User
    const userPassword = "UserPass123";
    const userHash = await bcrypt.hash(userPassword, 12);
    await User.create({
      name: "John Doe",
      email: "user@artisan.com",
      passwordHash: userHash,
      role: "user"
    });
    console.log(`👤 User created: user@artisan.com / ${userPassword}`);

    console.log("✨ Seeding completed successfully!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedUsers();
