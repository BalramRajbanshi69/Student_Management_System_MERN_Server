require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 5000;
const dbConnect = require("./Database/db");
dbConnect();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

// serve static files from the 'uploads' directory
app.use("/uploads", express.static("uploads"));

//routes
app.use("/api/auth", require("./routes/Auth"));
app.use("/api/students", require("./routes/Student_route"));
app.use("/api/contact", require("./routes/Contact_route"));

app.get('/',(req,res)=>{
  res.send('Hello World!')
})

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
