const express = require("express");
const { registerUser, loginUser, logoutUser, getLoggedInUser } = require("../controllers/authController");
let router = express.Router();

// file just for the abstracted routes for authentication
// to see functionality for functions passed into routes look at authController
// to see middleware for authenticating a user's jwt look at middleware/auth.js

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/loggedIn", getLoggedInUser);

module.exports = router;
