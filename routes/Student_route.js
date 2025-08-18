  const express = require("express");
const FetchUser = require("../middleware/FetchUser");
const permitTo = require("../middleware/permitTo");
const { addStudent, getAllStudents, deleteStudent, getSingleStudent, editStudent } = require("../controller/student.controller");
  const router = express.Router();
  
  const upload = require("../middleware/multerConfig")

  router.route("/")
  .get(getAllStudents)
  .post(FetchUser,permitTo("admin"),upload.single("image"),addStudent)


router.route("/:id")
.patch(FetchUser,permitTo("admin"),upload.single("image"),editStudent)
.delete(FetchUser,permitTo("admin"),deleteStudent)
.get(getSingleStudent)



  module.exports = router;




















