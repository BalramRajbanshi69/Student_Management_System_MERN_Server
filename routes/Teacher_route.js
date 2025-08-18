const express = require("express")
const FetchUser = require("../middleware/FetchUser")
const { addTeacher, getAllTeacher, getSingleTeacher, updateTeacher, deleteTeacher } = require("../controller/teacher.controller")
const router = express.Router()
const upload = require("../middleware/multerConfig")


router.route("/")
.post(FetchUser,upload.single("teacherImage"),addTeacher)
.get(getAllTeacher)

router.route("/:id")
.get(getSingleTeacher)
.patch(FetchUser,updateTeacher)
.delete(FetchUser,deleteTeacher)

module.exports = router