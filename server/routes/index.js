var express = require("express");
var path = require("path");
var router = express.Router();
var { readContentSync } = require("../../filePath");

/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("index", { title: "Express" });
});

router.get("/getDir", function (req, res, next) {
	// console.log(__dirname)
	let dir = path.resolve(__dirname, "../../");
	let targetDir = readContentSync(dir);
	console.log("指定目录", dir);
	// res.send(dir);
	res.json({ ...targetDir });
});

module.exports = router;
