const User = require("../models/User");
const bcrypt = require("bcryptjs")
const JWT_SECRET = process.env.JWT_SECRET
const jwt = require("jsonwebtoken")

exports.registerUser = async (req, res) => {
 
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

      // console.log("user",user);
      
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, JWT_SECRET); 

      res.status(201).json({success:true, msg: "Registration successful",data:user, token });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).send("Internal server error");
    }
  }



  exports.loginUser =  async (req, res) => {
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
            const token = jwt.sign(data, JWT_SECRET);
            res.status(200).json({success:true,data:user, msg: "Login successful", token });
            }
             catch (error) {
              console.error("Error during login:", error);
              res.status(500).send("Internal server error");
            }
              }



  exports.getAllUsers = async (req, res) => {
              try {

                const allUsers = await User.find().select("-password");
                res.status(200).json({
                  success: true,
                  data: allUsers,
                });
              } catch (error) {
                console.error(error);
                res.status(500).json({
                  success: false,
                  message: "Internal Server Error!",
                });
              }
            }            