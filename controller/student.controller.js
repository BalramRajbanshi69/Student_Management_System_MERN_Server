const StudentModel = require("../models/Students_model");
const cloudinary = require("cloudinary").v2;
const fs = require("fs")
const path = require("path");

// admin permission
exports.addStudent= async (req, res) => {

      try {
        // console.log("Request file:", req.file); 
           let imageURL;
        if (!req.file) {
            return res.status(400).json({
                message: "Image is required!"
            });
        } else {
            imageURL = req.file.path; // Use the uploaded image path
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
          user: req.user?.id,
        });  
        // console.log("Image URL:", imageURL); // Log the image URL
        // console.log("New Student Data:", student); // Log the newly created student data  
        res
          .status(201)
          .json({
            message: "Student added successfully",
            data: student,
          });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    }



 // update (admin student)
 exports.editStudent = async (req, res) => {
  try {
    const { id } = req.params;    
    const {name,email,age,course } = req.body;
  
     if (!name || !email || !age || !course  ) {
            return res.status(400).json({
                message: "All fields are required!"
            });
        }

    const oldData = await StudentModel.findById(id);
    if (!oldData) {
      return res.status(404).json({
        message: "No data found with that id"
      });
    }


    const oldStudentImageURL = oldData.image[0];
    let newImageURL = oldStudentImageURL;

    if (req.file) { // A new file was uploaded to Cloudinary
      // Extract the public_id from the old image URL
      const parts = oldStudentImageURL.split('/');
      const filenameWithExtension = parts[parts.length - 1]; // e.g., 'book-123456789.jpg'
      const oldPublicId = parts[parts.length - 2] + '/' + filenameWithExtension.split('.')[0]; // e.g., 'e-commerce-books/book-123456789'
      
      // Delete the old file from Cloudinary, but only if it's not the default image
      if (!oldStudentImageURL.startsWith("https://plus.unsplash.com")) {
        try {
          await cloudinary.uploader.destroy(oldPublicId);
          console.log("Old image deleted from Cloudinary successfully");
        } catch (err) {
          console.error("Error deleting old image from Cloudinary:", err);
        }
      }
      
      // Set the new image URL from the uploaded file
      newImageURL = req.file?.path;
    }

    const datas = await StudentModel.findByIdAndUpdate(id, {
     name, 
     email,
     age,
     course,
    image: [newImageURL]
    }, {
      new: true,
    });

    res.status(200).json({
      message: "Student updated successfully",
      data: datas
    });
  } catch (error) {
    console.error("Edit book error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};





  // delete student (admin)
  exports.deleteStudent = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Please provide book ID" });
    }

    const student = await StudentModel.findById(id);
    if (!student) {
      return res.status(404).json({ error: "student not found" });
    }

    // Extract the image URL and public_id from the book data
    const oldStudentImageURL = student.image[0];

    // Delete the image from Cloudinary, but only if it's not the default image
    if (oldStudentImageURL && !oldStudentImageURL.startsWith("https://plus.unsplash.com")) {
      const parts = oldStudentImageURL.split('/');
      const filenameWithExtension = parts[parts.length - 1];
      const oldPublicId = parts[parts.length - 2] + '/' + filenameWithExtension.split('.')[0];
      
      try {
        await cloudinary.uploader.destroy(oldPublicId);
        console.log(`Successfully deleted image from Cloudinary with public_id: ${oldPublicId}`);
      } catch (err) {
        console.error(`Error deleting image from Cloudinary with public_id: ${oldPublicId}:`, err);
      }
    }

    // Delete the book from the database
    await StudentModel.findByIdAndDelete(id);

    // // Remove the book from all user carts
    // await User.updateMany(
    //   {},
    //   { $pull: { cart: { book: id } } }
    // );

    // // Remove the book from all existing orders
    // await Order.updateMany(
    //   { 'items.book': id },
    //   { $pull: { items: { book: id } } }
    // );

    res.status(200).json({
      success: true,
      message: "student and associated image deleted successfully",
    });
  } catch (error) {
    console.error("Delete book error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



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