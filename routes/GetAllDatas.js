const express  = require("express");
const FetchUser = require("../middleware/FetchUser");
const permitTo = require("../middleware/permitTo");
const { getAllDatas } = require("../controller/getAllDatas");
const router = express.Router();

router.route("/datas").get(FetchUser,permitTo("admin"),getAllDatas)

module.exports = router