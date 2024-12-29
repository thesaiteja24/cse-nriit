/**
 * Faculty Data Seeder
 * 
 * This script connects to the database, clears the existing faculty data, 
 * and seeds the database with initial faculty data from `facultyData.js`.
 * 
 * Usage:
 * - Ensure the `.env` file contains a valid `ATLAS_DB_URL` for the database connection.
 * - Run this script to initialize or reset the faculty data collection.
 */

const mongoose = require("mongoose");
const initData = require("./facultyData"); // Import faculty data
const Faculty = require("../models/facultyModel"); // Import Faculty model
require("dotenv").config({ path: "../.env" }); // Load environment variables

// Database connection URL from environment variables
const dbUrl = process.env.ATLAS_DB_URL;

/**
 * Main function to connect to the database and initialize data.
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
 * Function to initialize faculty data in the database.
 * 
 * - Clears all existing faculty records.
 * - Inserts sample faculty data from `facultyData.js`.
 */
const initDB = async () => {
  try {
    // Clear existing data
    await Faculty.deleteMany({});
    console.log("Faculty collection cleared.");

    // Insert new data
    await Faculty.insertMany(initData.data);
    console.log("Faculty data initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize data:", error);
  }
};

// Run the main function
main();
