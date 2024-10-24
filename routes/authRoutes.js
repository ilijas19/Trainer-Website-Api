const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

const {
  registerTrainer,
  loginTrainer,
  trainerPasswordReset,
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controllers/authController");

//admin
router.post(
  "/reg-trainer",
  authenticateUser,
  authorizePermission("admin"),
  registerTrainer
);

router.post("/log-trainer", loginTrainer);

router.post(
  "/reset-trainer",
  authenticateUser,
  authorizePermission("admin"),
  trainerPasswordReset
);

//user
router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.delete("/logout", authenticateUser, logout);

module.exports = router;
