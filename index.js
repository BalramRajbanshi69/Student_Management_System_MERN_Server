require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 5000;
const dbConnect = require("./Database/db");
dbConnect();

// middleware
app.use(cors({
  origin:["https://sms-mern.vercel.app","https://student-management-system-admincls.vercel.app","http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const authRoute = require("./routes/Auth")
const studentRoute = require("./routes/Student_route")
const profileRoute = require("./routes/Profile_route")
const teacherRoute = require("./routes/Teacher_route")
const getAllDatasRoute = require("./routes/GetAllDatas")
const userRoute = require("./routes/User_route")


//routes
app.use("/api/auth", authRoute);
app.use("/api/students",studentRoute);
app.use("/api/profile",profileRoute)
app.use("/api/teachers",teacherRoute)
app.use("/api/all",getAllDatasRoute)
app.use("/api/users",userRoute)

app.use("/api/contact", require("./routes/Contact_route"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
