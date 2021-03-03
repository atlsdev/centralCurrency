var express = require("express");
var session = require("express-session");
var fs = require("fs");
var bodyParser = require("body-parser");

var server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
server.use(express.static("public"));
server.use(session({ secret: "atlasdevvcurr", resave: false , saveUninitialized: true, cookie: { secure: false } }));
server.set("views", "./views");
server.set('view engine', "ejs");
server.use("/api/users", require("./routes/users"));
server.use("/api/currency", require("./routes/currency"));
server.use("/auth", require("./routes/auth"));

server.get("/", (req, res) => {
	if(req.session.loggedIn) {
		res.render("index", { user: req.session.user, page: "Home" });
	} else {
		res.render("index", { user: null, page: "Home" });
	}
});

server.get("/login", (req, res) => {
	if(req.session.loggedIn) {
		res.redirect("/");
	} else {
		res.render("login", { user: null, page: "Login" });
	}
});

server.get("/register", (req, res) => {
	if(req.session.loggedIn) {
		res.redirect("/");
	} else {
		res.render("register", { user: null, page: "Register" });
	}
});

server.get("/logout", (req, res) => {
	if(req.session.loggedIn) {
		req.session.destroy(_ => res.redirect("/"));
	} else {
		res.redirect("/");
	}
});

server.get("/api", (req, res) => {
	res.send("♥");
});

server.listen(99, _ => console.log(`Atlas Currency - Listening on localhost:99`));