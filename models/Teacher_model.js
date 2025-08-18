const mongoose = require("mongoose");
const teacherSchema = new mongoose.Schema({
    teacherName: {
        type: String,
        required: [true, "TeacherName is required"]
    },
    teacherEmail: {
        type: String,
        required: [true, "TeacherEmail is required"]
    },
    teacherAge: {
        type: Number, 
        required: [true, "TeacherAge is required"]
    },
    teacherAddress: {
        type: String,
        required: [true, "TeacherAddress is required"]
    },
    teacherSubject: [{
        type: String,
        required: [true, "TeacherSubject is required"]
    }],
    teacherImage:{
        type:[String],
        required:[true,"TeacherImage is required"]
    }
});

const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;