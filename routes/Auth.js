const express = require("express");
const { registerUser, loginUser, getAllUsers } = require("../controller/auth.controller");
const router = express.Router();


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/allusers").get(getAllUsers)


module.exports = router;
