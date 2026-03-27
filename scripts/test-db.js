const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env vars from .env.local
dotenv.config({ path: path.join(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
  console.log("🔍 Testing MongoDB Connection...");
  
  if (!MONGODB_URI || MONGODB_URI.includes("<user>")) {
    console.error("❌ Error: MONGODB_URI is not set correctly in .env.local");
    console.log("Please update .env.local with your actual MongoDB Atlas connection string.");
    process.exit(1);
  }

  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Successfully connected to MongoDB!");
    
    // Check database name
    const dbName = mongoose.connection.name;
    console.log(`📂 Database Name: ${dbName}`);
    
    await mongoose.disconnect();
    console.log("👋 Disconnected cleanly.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Connection failed!");
    console.error(error.message);
    process.exit(1);
  }
}

testConnection();
