if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
const db_url =
  process.env.ATLAS_DB_URL || "mongodb://localhost:27017/cse-nriit";

// Mongo Connection
async function main() {
  await mongoose
    .connect(db_url)
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.error("Failed to connect to DB:", err));
}
main();

// Middleware Config
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/login", (req, res) => {
  let response = { ...req.body, message: "User Logged in Successfully" };
  res.send(response);
});

app.post("/register", (req, res) => {
  let response = { ...req.body, message: "User Registered Successfully" };
  res.send(response);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
