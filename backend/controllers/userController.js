const User = require("../models/userModel");
const passport = require("passport");

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  exports.registerUser = async (req, res) => {
    try {
      const { fullname, email, password } = req.body;
  
      if (!fullname || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
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
  
      const user = new User({ fullname, email, role: "user" });
      await User.register(user, password);
  
      // Automatically log in the user after registration
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login after registration failed" });
        }
        res.status(201).json({
          success: true,
          message: "User registered and logged in successfully",
          user: {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
          },
        });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

  exports.loginUser = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: "Internal Server Error" });
      }
  
      if (!user) {
        return res.status(400).json({ message: info.message || "Invalid credentials" });
      }
  
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login failed" });
        }
        res.status(200).json({
          message: "Login successful",
          user: {
            id: user._id,
            email: user.email,
            fullname: user.fullname,
            role: user.role,
          },
        });
      });
    })(req, res, next);
  };
  

  exports.logout = (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  };
  

  exports.getMe = (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    // req.user contains the authenticated user's details
    res.status(200).json({
      user: {
        id: req.user._id,
        fullname: req.user.fullname,
        email: req.user.email,
        role: req.user.role,
      },
    });
  };  
