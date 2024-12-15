const User = require("../models/user");
const passport = require("passport");

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

exports.registerUser = async (req, res) => {
  try {
    const fullname = req.body.fullname?.trim();
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();

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

    const user = new User({ fullname, email });
    await User.register(user, password);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email does not exist" });
    }

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (!user) {
        return res.status(400).json({ message: "Incorrect password" });
      }

      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error during login" });
        }
        return res.status(200).json({ message: "Login successful", user });
      });
    })(req, res, next);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
