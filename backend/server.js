// Load environment variables in non-production environments
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Import dependencies
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const connectDB = require("./config/db");
const configurePassport = require("./config/passport");
const Routes = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");

// Define environment-specific constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;
const db_url =
  process.env.ATLAS_DB_URL || "mongodb://localhost:27017/cse-nriit";

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB(db_url);

// CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL, // Allow requests from this origin
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};

// Apply CORS middleware
if (isProduction) {
  app.set("trust proxy", 1); // Trust proxy in production for secure cookies
}
app.use(cors(corsOptions));

// Middleware for parsing request bodies
app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads

// Session Configuration
const store = MongoStore.create({
  mongoUrl: db_url, // MongoDB connection URL
  secret: process.env.SESSION_KEY, // Session encryption key
  touchAfter: 24 * 3600, // Session store update frequency (in seconds)
});

store.on("error", (err) => {
  console.error("ERROR in Mongo Session Store:", err);
});

const sessionOptions = {
  store: store,
  secret: process.env.SESSION_KEY, // Session encryption key
  resave: false, // Prevent unnecessary session save
  saveUninitialized: false, // Do not save empty sessions
  proxy: isProduction, // Trust proxy in production
  cookie: {
    secure: isProduction, // Use secure cookies in production
    sameSite: isProduction ? "none" : "lax", // SameSite policy based on environment
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration (7 days)
    httpOnly: true, // Prevent client-side access to cookies
  },
};

// Apply session middleware
app.use(session(sessionOptions));

// Passport Configuration
configurePassport(app);

// Mount Routes
app.use("/", Routes);

// Error handling middleware
app.use(errorHandler);

// Start the Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
