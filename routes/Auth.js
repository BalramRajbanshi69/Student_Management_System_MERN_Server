const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// register user
router.post(
  "/registeruser",
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt);

      user = await User.create({
        name,
        email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET); 

      res.status(201).json({success:true,user, msg: "Registration successful", authToken });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).send("Internal server error");
    }
  }
);



// login user
router.post("/loginuser", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
        }
        const data = {
          user: {
            id: user.id,
            },
            };
            const authToken = jwt.sign(data, JWT_SECRET);
            res.status(200).json({success:true,user, msg: "Login successful", authToken });
            }
             catch (error) {
              console.error("Error during login:", error);
              res.status(500).send("Internal server error");
            }
              }
            )


            // getallloginusers
  router.get("/getallusers", async (req, res) => {
              try {

                const allUsers = await User.find().select("-password");
                res.status(200).json({
                  success: true,
                  users: allUsers,
                });
              } catch (error) {
                console.error(error);
                res.status(500).json({
                  success: false,
                  message: "Internal Server Error!",
                });
              }
            });


module.exports = router;
