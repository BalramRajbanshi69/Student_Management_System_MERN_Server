const StudentModel = require("../models/Students_model");

// admin permission
exports.addStudent= async (req, res) => {

      try {

         let imageURL;

    if (!req.file) {
        imageURL = "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D";
    } else {
 
        imageURL = req.file.path;
    }
        const { name, email, age, course } = req.body;
        if(!name || !email || !age || !course){
          return res.status(400).json({
            message:"All fields required!"
          })
        }
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
          image:[imageURL],
          user: req.user?.id,s
        });
        const savedStudent = await student.save();
        res
          .status(201)
          .json({
            message: "Student added successfully",
            data: savedStudent,
          });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    }



 // update (admin student)
 exports.updateStudent =  async (req, res) => {
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
        .json({ message: "Student updated successfully", data: newStudent });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }   



  // delete student (admin)
  exports.deleteStudent =  async (req, res) => {
    try {
      const studentId = req.params.id;

      let student = await StudentModel.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      await StudentModel.findByIdAndDelete(studentId);
      res
        .status(200)
        .json({ message: "Student deleted successfully", data: student });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }



  // getAllstudents(all no permision to see / visit)
  exports.getAllStudents =  async (req, res) => {
    try {

      const students = await StudentModel.find()

      res.status(200).json({
      message:"All students fetched",
      data:students
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }



  // getStudentById
  exports.getSingleStudent =  async (req, res) => {
    try {
      const studentId = req.params.id;
      const student = await StudentModel.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.status(200).json({ success: true, data: student });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }