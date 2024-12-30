/**
 * Course Data Seeder
 *
 * This script connects to the database, clears the existing course data,
 * and seeds the database with initial course data from `courseData.js`.
 *
 * Usage:
 * - Ensure the `.env` file contains a valid `ATLAS_DB_URL` for the database connection.
 * - Run this script to initialize or reset the course data collection.
 */

const mongoose = require("mongoose");
const initData = require("./courseData"); // Import course data
const Course = require("../models/courseModel"); // Import Course model
require("dotenv").config({ path: "../.env" }); // Load environment variables

// Database connection URL from environment variables
const dbUrl = process.env.ATLAS_DB_URL;

/**
 * Main function to connect to the database and initialize course data.
 */
async function main() {
  if (!dbUrl) {
    console.error("Error: ATLAS_DB_URL not found in environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to the database.");
    await initDB(); // Seed data after successful connection
  } catch (err) {
    console.error("Error connecting to the database:", err);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

/**
 * Function to initialize course data in the database.
 *
 * - Clears all existing course records.
 * - Inserts sample course data from `courseData.js`.
 */
const initDB = async () => {
  try {
    // Clear existing course data
    await Course.deleteMany({});
    console.log("Courses collection cleared.");

    // Insert new course data
    await Course.insertMany(initData.data);
    console.log("Course data initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize data:", error);
  }
};

// main function
main();
