require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");


const app = express();
const port = process.env.PORT || 3000;
const db_url = process.env.ATLAS_DB_URL || "mongodb://localhost:27017/cse-nriit";

// Mongo Connection
async function main() {
  await mongoose
    .connect(db_url)
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.error("Failed to connect to DB:", err));
}
main();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
