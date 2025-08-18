const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    image: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const StudentModel = mongoose.model("Student", studentSchema);
module.exports = StudentModel;
