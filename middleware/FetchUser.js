// const jwt = require("jsonwebtoken");
// const JWT_SECRET = process.env.JWT_SECRET;

// const FetchUser = async (req, res, next) => {
//   const token = req.header("Authorization");

//   if (!token) {
//     return res.status(401).json({
//       msg: "Access Denied. No token provided",
//     });
//   }

//   try {
//     const data = await jwt.verify(token, JWT_SECRET);
//     req.user = data.user;
//     next();
//   } catch (error) {
//     return res.status(401).json({
//       msg: "Invalid Token",
//     });
//   }
// };

// module.exports = FetchUser;







const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET;


const FetchUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Please provide a valid token" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const doesUserExist = await User.findOne({ _id: decoded.id });

        if (!doesUserExist) {
            return res.status(401).json({ message: "User  does not exist with that token/id" });
        }

        req.user = doesUserExist;
        next();
    } catch (error) {
        console.error("JWT Authentication Error:", error.message);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(401).json({ message: "Authentication failed" });
    }
};

module.exports = FetchUser;