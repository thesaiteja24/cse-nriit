if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const connectDB = require("./config/db");
const configurePassport = require("./config/passport");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const facultyRoutes = require("./routes/facultyRoutes");

const app = express();
const port = process.env.PORT || 3000;
const db_url =
  process.env.ATLAS_DB_URL || "mongodb://localhost:27017/cse-nriit";

// Connect to DB
connectDB(db_url);

// Middleware
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration

const store = MongoStore.create({
  mongoUrl: db_url,
  secret: process.env.SESSION_KEY,
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});
const sessionOptions = {
  store: store,
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false, // Prevents saving uninitialized sessions
  cookie: {
    secure: process.env.NODE_ENV === "production", // Enable in production
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // Prevent client-side access to cookies
    sameSite: "none"
  },
};

app.use(session(sessionOptions));

// Passport
configurePassport(app);

// Routes
app.get("/", (req, res) => {
  res.send("OK");
});
app.use("/", userRoutes);
app.use("/", courseRoutes);
app.use("/", facultyRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
