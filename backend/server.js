if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const User = require("./models/user");

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
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport to use the User model
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/register", async (req, res) => {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate password strength
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Register new User
    const user = new User({ fullname, email });
    await User.register(user, password);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
});

app.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).json({ message: "Login successful", user: req.user });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
