const passport = require("passport");
const User = require("../models/userModel");

/**
 * Configures Passport.js for user authentication.
 *
 * @param {object} app - The Express application instance.
 */
module.exports = function configurePassport(app) {
  // Initialize Passport middleware
  app.use(passport.initialize()); // Initializes Passport
  app.use(passport.session());    // Enables persistent login sessions

  // Configure Passport to use the User model's strategy
  passport.use(User.createStrategy());

  // Serialize user data into the session
  passport.serializeUser(User.serializeUser());

  // Deserialize user data from the session
  passport.deserializeUser(User.deserializeUser());
};
