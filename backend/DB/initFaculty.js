const mongoose = require("mongoose");
const initData = require("./facultyData"); // Import course data
const Faculty = require("../models/facultyModel"); // Import Course model
require("dotenv").config({ path: "../.env" }); // Load environment variables

const dbUrl = process.env.ATLAS_DB_URL;

main()
  .then(() => {
    console.log("Connected to DB");
    return initDB(); // Call data initialization after successful DB connection
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
  });

async function main() {
  if (!dbUrl) {
    console.error("Error: ATLASDB_URL not found in environment variables.");
    process.exit(1);
  }
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  try {
    // Clear existing data
    await Faculty.deleteMany({});
    console.log("Courses collection cleared.");

    // Insert new data
    await Faculty.insertMany(initData.data);
    console.log("Sample course data initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize data:", error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
};
