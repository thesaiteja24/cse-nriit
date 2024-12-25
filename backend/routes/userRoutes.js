const express = require("express");
const auth = require("../middlewares/auth");
const {
  registerUser,
  loginUser,
  logout,
  getMe,
} = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/getuser", auth, getMe);
module.exports = router;
