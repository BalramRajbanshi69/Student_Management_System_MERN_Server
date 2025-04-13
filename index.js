require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
// const path = require("path");
// const fs = require("fs");
// const multer = require("multer");
const PORT = process.env.PORT || 5000;
const dbConnect = require("./Database/db");
dbConnect();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Ensure the uploads directory exists
// const ensureUploadsDirectoryExists = () => {
//   const dir = path.join(__dirname, "uploads");
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// };

// // call this to create directory if it doesn't exist
// ensureUploadsDirectoryExists();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     ensureUploadsDirectoryExists(); // Ensure the directory exists before saving the file
//     cb(null, path.join(__dirname, "uploads")); // use absolute path to avoid issues
//   },
//   filename: function (req, file, cb) {
//     let ext = path.extname(file.originalname);
//     const uniqueSuffix =
//       Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
//     cb(null, file.fieldname + "-" + uniqueSuffix);
//   },
// });

// const upload = multer({ storage: storage });

// // serve static files from the uploads directory
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Route to handle file uploads
// app.post("/upload", upload.single("file"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send("No file uploaded.")
//   }
//   res.send({ filePath: `/uploads/${req.file.filename}` })
// })

//routes
app.use("/api/auth", require("./routes/Auth"));
app.use("/api/students",require("./routes/Student_route"));
app.use("/api/contact", require("./routes/Contact_route"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
