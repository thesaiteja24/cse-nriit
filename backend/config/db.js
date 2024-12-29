const mongoose = require("mongoose");

/**
 * Connects to the MongoDB database using the provided connection URL.
 *
 * @param {string} db_url - The MongoDB connection string.
 * @returns {Promise<void>} Resolves when the connection is successful.
 * @throws Will log an error and terminate the process if the connection fails.
 */
const connectDB = async (db_url) => {
  try {
    await mongoose.connect(db_url);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1); // Exit the process with a non-zero status
  }
};

module.exports = connectDB;
