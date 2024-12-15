if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const session = require("express-session");
const cors = require("cors");
const connectDB = require("./config/db");
const configurePassport = require("./config/passport");
const userRoutes = require("./routes/user");

const app = express();
const port = process.env.PORT || 3000;
const db_url = process.env.ATLAS_DB_URL || "mongodb://localhost:27017/cse-nriit";

// Connect to DB
connectDB(db_url);

// Middleware
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

// Passport
configurePassport(app);

// Routes
app.use("/", userRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
