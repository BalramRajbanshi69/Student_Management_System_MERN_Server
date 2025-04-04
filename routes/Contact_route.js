const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Contact = require('../models/Contact_model')

// Contact form submission route with validation
router.post(
  "/",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("subject").trim().isLength({ min: 3 }).withMessage("Subject must be at least 3 characters"),
    body("message").trim().isLength({ min: 10 }).withMessage("Message must be at least 10 characters"),
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const { name, email, subject, message } = req.body;

      // Create a new Contact document
      const newContact = new Contact({
        name,
        email,
        subject,
        message,
      });

      // Save to database
      await newContact.save();

      res.status(201).json({
        success: true,
        contact: newContact,
        message: "Contact form submitted successfully!"
      });

    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }
);

module.exports = router;