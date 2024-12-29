const express = require("express");
const { authMiddleware } = require("../middlewares/auth");
const {
  registerUser,
  loginUser,
  logout,
  getMe,
} = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logout);
router.get("/getuser", getMe);
module.exports = router;