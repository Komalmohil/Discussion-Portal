const jwt = require("jsonwebtoken");
const User = require("../models/User");

const secretKey = process.env.JWT_SECRET || "secretkey123";

exports.getLogin = (req, res) => {
    res.render("login");
};

exports.getSignup = (req, res) => {
    res.render("signup");
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).send("Invalid credentials");
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            secretKey,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, { httpOnly: true });
        res.redirect("/");
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).send("Server error");
    }
};

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("Email already registered");
        }

        const newUser = await User.create({ username, email, password });

        const token = jwt.sign(
            { id: newUser._id, username: newUser.username },
            secretKey,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, { httpOnly: true });
        res.redirect("/");
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).send("Server error");
    }
};

exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
};