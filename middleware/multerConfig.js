const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Configure the Cloudinary storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "student_management", 
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: (req, file) => {
      // You can generate a unique public_id here if needed
      return `students-${Date.now()}`;
    },
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = ["image/jpg", "image/png", "image/jpeg"];
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("This file type is not supported"), false);
    }
  },
});

module.exports = upload;