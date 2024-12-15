const passport = require("passport");
const User = require("../models/user");

module.exports = function configurePassport(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
};
