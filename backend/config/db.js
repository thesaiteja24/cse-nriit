const mongoose = require("mongoose");

const connectDB = async (db_url) => {
  try {
    await mongoose.connect(db_url);
    console.log("Connected to DB");
  } catch (err) {
    console.error("Failed to connect to DB:", err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
