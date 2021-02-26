var express = require("express");
var fs = require("fs");

var server = express();

server.use(express.static("public"));
server.use(require("./routes/users"));
server.use(require("./routes/currency"));

server.listen(99, _ => console.log(`Atlas Currency - Listening on localhost:99`));