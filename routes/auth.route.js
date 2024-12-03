const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { check, validationResult } = require("express-validator");

const router = express.Router();
const User = require("../models/User.model"); // Add a User model

JWT_SECRET = process.env.JWT_SECRET; // Change this to a secure key

// Register User
router.post(
  "/register",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password,role } = req.body;

    try {
      let user = await User.findOne({ email,password,role });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ email, password: hashedPassword,role });

      await user.save();

      // const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
      // console.log(token)
      // res.json({ token });
      res.send("user Register successfully")
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Login User
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password,role } = req.body;

    try {
      const user = await User.findOne({ email});
      // console.log(user)
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const isMatch = await  bcrypt.compare(password, user.password);
      // console.log(isMatch)
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id ,role:user.role}, JWT_SECRET, { expiresIn: "1h" });
      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);


module.exports = router
