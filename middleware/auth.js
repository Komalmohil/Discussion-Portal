const jwt = require("jsonwebtoken");
const User = require("../models/User");

const secretKey = "secretkey123";

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies?.token; 
    if (!token) {
      res.locals.user = null; 
      return next();
    }

    const decoded = jwt.verify(token, secretKey);
    const user = await User.findById(decoded.id).select("username email");

    if (!user) {
      res.locals.user = null;
      return next();
    }
    req.user = user;
    res.locals.user = user;

    next();
  } catch (err) {
    console.error("JWT error:", err);
    res.locals.user = null;
    next();
  }
};
