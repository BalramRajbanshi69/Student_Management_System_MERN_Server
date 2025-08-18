const express = require("express");
const FetchUser = require("../middleware/FetchUser");
const permitTo = require("../middleware/permitTo");
const { getUsers, deleteUser } = require("../controller/user.controller");
const router = express.Router();


router.route("/").get(FetchUser,permitTo("admin"),getUsers)
router.route("/:id").delete(FetchUser,permitTo("admin"),deleteUser)


module.exports = router   