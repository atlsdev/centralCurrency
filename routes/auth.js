var express = require("express");
var fs = require("fs");
var router = express.Router();

router.get("/", (req,res) => {
	res.send("♥");
});

module.exports = router;