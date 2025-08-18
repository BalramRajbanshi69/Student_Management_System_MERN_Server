const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET;

// register user
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!email || !password || !name) {
            return res.status(400).json({
                message: "Please provide name, email, and password."
            });
        }

        // Use findOne for a more efficient check
        const userFound = await User.findOne({ email });
        if (userFound) {
            return res.status(400).json({
                message: "User with that email already registered.",
                data: []
            });
        }
        

        // Use async bcrypt.hash()
        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(password, salt);

        const userData = await User.create({
            name,
            email,
            password: secPassword,
        });
        
        res.status(201).json({
            message: "User registered successfully.",
            data: userData
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// login user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all the required fields!" });
        }

        // Exclude the password from the returned document
        const userFound = await User.findOne({ email });
        if (!userFound) {
            return res.status(400).json({ message: "Invalid credentials" });
        }        
        
        
        // Use async bcrypt.compare()
        const isMatched = await bcrypt.compare(password, userFound.password);
        if (!isMatched) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: userFound._id }, JWT_SECRET, { expiresIn: "30d" });
        
        
        return res.status(200).json({ message: "User logged in successfully", data: userFound, token });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};








