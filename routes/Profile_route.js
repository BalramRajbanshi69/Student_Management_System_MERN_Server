const express = require("express")
const FetchUser = require("../middleware/FetchUser")
const { getMyProfile, deleteMyProfile, updateMyProfile, updateMyPassword } = require("../controller/profile.controller")
const router = express.Router()


router.route("/")
.get(FetchUser,getMyProfile)
.delete(FetchUser,deleteMyProfile)
.patch(FetchUser,updateMyProfile)

router.route("/changePassword").patch(FetchUser,updateMyPassword)

module.exports = router