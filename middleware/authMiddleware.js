// const jwt = require("jsonwebtoken")
// const JWT_SECRET = "vermaji78";

// const authMiddleware = (req, res, next) => {
//   const token = req.headers.authorization.split(' ')[1];
//   console.log(token)
//   if (!token) {
//     return res.status(401).json({ msg: "No token, authorization denied" });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: "Token is not valid" });
//   }
// };

// module.exports = authMiddleware;

const jwt = require("jsonwebtoken");
require("dotenv").config()
const User = require("../models/User.model");

const JWT_SECRET = process.env.JWT_SECRET; // Ensure you use the same secret key as in your auth route

// Middleware to verify token and user role
const authMiddleware = (roles = []) => {
  // roles can be a single role (string) or an array of roles
  if (typeof roles === "string") {
    roles = [roles];
  }

  return async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ msg: "Access denied" });
      }

      req.role = decoded.role; // Add user data to request object
      next();
    } catch (err) {
      console.error(err.message);
      res.status(401).json({ msg: "Token is not valid" });
    }
  };
};

module.exports = authMiddleware;
