var express = require("express");
var session = require("express-session");
var fs = require("fs");

var server = express();

server.use(express.static("public"));
server.use(session({ secret: "atlasdevvcurr", resave: false , saveUninitialized: true, cookie: { secure: false } }));
server.set("views", "./views");
server.set('view engine', "ejs");
server.use("/api/users", require("./routes/users"));
server.use("/api/currency", require("./routes/currency"));
server.use("/auth", require("./routes/auth"));

server.get("/", (req, res) => {
	if(req.session.user) {
		res.render("index", { user: req.session.user });
	} else {
		res.render("index", { user: null });
	}
});

server.get("/login", (req, res) => {
	if(req.session.user) {
		res.redirect("/");
	} else {
		res.render("login");
	}
});

server.get("/logout", (req, res) => {
	if(req.session.user) {
		req.session.destroy(_ => res.redirect("/"));
	}
});

server.listen(99, _ => console.log(`Atlas Currency - Listening on localhost:99`));