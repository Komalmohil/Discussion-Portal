const express = require("express");
const router = express.Router();
const { getLogin, login, getSignup, signup } = require("../controllers/authController");

router.get("/login", getLogin);
router.post("/login", login);

router.get("/signup", getSignup);
router.post("/signup", signup);

module.exports = router;
