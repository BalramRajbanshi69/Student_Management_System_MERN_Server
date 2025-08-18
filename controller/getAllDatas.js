const StudentModel = require("../models/Students_model")
const Teacher = require("../models/Teacher_model")
const User = require("../models/User")


exports.getAllDatas = async(req,res)=>{                         // to show in dashboard
    const users = (await User.find()).length
    const students = (await StudentModel.find()).length
    const teachers = (await Teacher.find()).length

    res.status(200).json({
        message:"Datas fetched successfully",
        data:{
            users,
            students,
            teachers
        }
    })
}