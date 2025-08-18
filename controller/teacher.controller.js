const Teacher = require("../models/Teacher_model")
const cloudinary = require("cloudinary").v2;
const fs = require("fs")
const path = require("path");

exports.addTeacher = async(req,res)=>{
    try {
            let imageURL;
        if (!req.file) {
            return res.status(400).json({
                message: "Teacher image is required!"
            });
        } else {
            imageURL = req.file?.path; 
        }
        
       const {teacherName,teacherEmail,teacherAge,teacherSubject,teacherAddress} = req.body
      //  console.log(req.body);
       
       if(!teacherName || !teacherAddress || !teacherAge || !teacherEmail || !teacherSubject ){
        return res.status(400).json({
            message:"All fields are required!"
        })
       } 

        let teacher = await Teacher.findOne({ teacherEmail });
        if (teacher) {
          return res
            .status(400)
            .json({ error: "Teacher with this email already exists" });
        }

        teacher = await Teacher.create({
        ...req.body,
        teacherImage:[imageURL],
        user: req.user?.id,
       })
      //  console.log("teacher",teacher);
      //  console.log("teacher",teacher.teacherImage);
       
       res.status(200).json({
        message:"Teacher Added successfully!",
        data:teacher
       })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message:"Internal Server Error"
        })
        
    }
}


exports.getAllTeacher = async(req,res)=>{
    try {
        const teacher = await Teacher.find()
        res.status(200).json({
            message:"All teachers fetched",
            data:teacher
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message:"Internal Server Error!"
        })
        
    }
}


  // getteacherById
  exports.getSingleTeacher =  async (req, res) => {
    try {
      const teacherId = req.params.id;
      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }
      res.status(200).json({ success: true, data: teacher });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }







  exports.updateTeacher = async (req, res) => {
    try {
      const { id } = req.params;    

      const {teacherName,teacherEmail,teacherAge,teacherSubject,teacherAddress} = req.body
       if(!teacherName || !teacherAddress || !teacherAge || !teacherEmail || !teacherSubject ){
        return res.status(400).json({
            message:"All fields are required!"
        })
       } 

      const oldData = await Teacher.findById(id);
      if (!oldData) {
        return res.status(404).json({
          message: "No data found with that id"
        });
      }
  
  
      const oldTeacherImageURL = oldData.teacherImage[0];
      let newImageURL = oldTeacherImageURL;
  
      if (req.file) { // A new file was uploaded to Cloudinary
        // Extract the public_id from the old image URL
        const parts = oldTeacherImageURL.split('/');
        const filenameWithExtension = parts[parts.length - 1]; // e.g., 'book-123456789.jpg'
        const oldPublicId = parts[parts.length - 2] + '/' + filenameWithExtension.split('.')[0]; // e.g., 'e-commerce-books/book-123456789'
        
        // Delete the old file from Cloudinary, but only if it's not the default image
        if (!oldTeacherImageURL.startsWith("https://plus.unsplash.com")) {
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
  
      const datas = await Teacher.findByIdAndUpdate(id, {
      ...req.body,
      teacherImage: [newImageURL]
      }, {
        new: true,
      });
  
      res.status(200).json({
        message: "Teacher updated successfully",
        data: datas
      });
    } catch (error) {
      console.error("Edit teacher error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };




    exports.deleteTeacher = async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Please provide teacher ID" });
      }
  
      const teacher = await Teacher.findById(id);
      if (!teacher) {
        return res.status(404).json({ error: "teacher not found" });
      }
  
      // Extract the image URL and public_id from the book data
      const oldTeacherImageURL = teacher.teacherImage[0];
  
      // Delete the image from Cloudinary, but only if it's not the default image
      if (oldTeacherImageURL && !oldTeacherImageURL.startsWith("https://plus.unsplash.com")) {
        const parts = oldTeacherImageURL.split('/');
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
      await Teacher.findByIdAndDelete(id);

  
      res.status(200).json({
        success: true,
        message: "Teacher and associated image deleted successfully",
      });
    } catch (error) {
      console.error("Delete teacher error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };