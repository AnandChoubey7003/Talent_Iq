import mongoose from "mongoose";

import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    if (!ENV.DB_URL || ENV.DB_URL.includes("your_mongodb_connection_url")) {
      console.warn("⚠️ DB_URL is missing or unconfigured in backend/.env. Please add your MongoDB URL to backend/.env.");
      return;
    }
    const conn = await mongoose.connect(ENV.DB_URL);
    console.log("✅ Connected to MongoDB:", conn.connection.host);
  } catch (error) {
    console.error("❌ Error connecting to MongoDB", error);
  }
};
