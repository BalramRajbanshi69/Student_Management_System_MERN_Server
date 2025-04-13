  const express = require("express");
  const router = express.Router();
  const { body, validationResult } = require("express-validator");
  const StudentModel = require("../models/Students_model");
  const FetchUser = require("../middleware/FetchUser");

  // Add a new student
  router.post(
    "/",
    FetchUser,
    [
      body("name", "Enter a valid name").isLength({ min: 2 }).matches(/^[a-zA-Z\s]*$/),
      body("email", "Enter a valid email").isEmail(),
      body("age", "Age must be a number").isInt({ min: 1 }),
      body("course", "Enter a valid course").isLength({ min: 2 }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      try {
        const { name, email, age, course } = req.body;
        let student = await StudentModel.findOne({ email });
        if (student) {
          return res
            .status(400)
            .json({ error: "Student with this email already exists" });
        }

        student = await StudentModel.create({
          name,
          email,
          age,
          course,
          user: req.user.id,
        });
        const savedStudent = await student.save();
        res
          .status(201)
          .json({
            message: "Student added successfully",
            student: savedStudent,
          });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Update an existing student
  router.put("/:id", FetchUser, async (req, res) => {
    try {
      const studentId = req.params.id;
      const { name, email, age, course } = req.body;

      let student = await StudentModel.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      const updatedStudent = {};
      if (name) updatedStudent.name = name;
      if (email) updatedStudent.email = email;
      if (age) updatedStudent.age = age;
      if (course) updatedStudent.course = course;

      const newStudent = await StudentModel.findByIdAndUpdate(
        studentId,
        { $set: updatedStudent },
        { new: true }
      );

      res
        .status(200)
        .json({ message: "Student updated successfully", student: newStudent });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Delete a student
  router.delete("/:id", FetchUser, async (req, res) => {
    try {
      const studentId = req.params.id;

      let student = await StudentModel.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      await StudentModel.findByIdAndDelete(studentId);
      res
        .status(200)
        .json({ message: "Student deleted successfully", student: student });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all students with pagination and search
  router.get("/", FetchUser, async (req, res) => {
    try {
      const { searchQuery, page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;
      const query = searchQuery
        ? {
            $or: [
              { name: { $regex: searchQuery, $options: "i" } },
              { course: { $regex: searchQuery, $options: "i" } },
            ],
          }
        : {};

      const students = await StudentModel.find(query)
        .skip(skip)
        .limit(parseInt(limit));

      const totalStudents = await StudentModel.countDocuments(query);
      const totalPages = Math.ceil(totalStudents / limit);

      res.status(200).json({
        success: true,
        students,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Get student by id
  router.get("/:id", FetchUser, async (req, res) => {
    try {
      const studentId = req.params.id;
      const student = await StudentModel.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.status(200).json({ success: true, student: student });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  module.exports = router;




















