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
const JWT_SECRET = process.env.JWT_SECRET;

const FetchUser = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  // console.log("Authorization Header:", authHeader);
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      msg: "Access Denied. No token provided",
    });
  }
  if (!authHeader.startsWith("Bearer")) {
    return res.status(401).json({
      success: false,
      msg: "Invalid token format. Bearer token expected.",
    });
  }
  const token = authHeader.split(" ")[1];
  // console.log("Token:", token);
  try {
    const data = await jwt.verify(token, JWT_SECRET);
    // console.log("Decoded User:", data);
    req.user = data.user

    // req.user = { id: data.id }; 
    // since you have => id   =>  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    // console.log("Assigned req.user:", req.user);
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(401).json({
      success: false,
      msg: "Invalid Token",
      details: error.message,
    });
  }
};

module.exports = FetchUser;