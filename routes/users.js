var express = require("express");
var fs = require("fs");
var bcrypt = require("bcrypt");
var router = express.Router();

var users = JSON.parse(fs.readFileSync(`${__dirname}/../db/users.json`, "utf8"));

router.get("/", (req,res) => {
	res.send("♥");
});

router.post("/register", (req, res) => {
	users = JSON.parse(fs.readFileSync(`${__dirname}/../db/users.json`, "utf8"));

	var body = req.body;
	var email = body.email;
	var pass = body.pass;

	if(users) {
		if(email) {
			if(pass) {
				if(Object.keys(users).includes(email.toLowerCase())) {
					res.send({ status: 409, msg: "User already exists." });
				} else {
					if(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i.test(email)) {
						if(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(pass)) {
							bcrypt.genSalt(10, (err, salt) => bcrypt.hash(pass, salt, (errr, hash) => {
								var password = hash;
								users[email.toLowerCase()] = { id: (Object.values(users).length+1), email, pass: password, createdAt: new Date()};
								fs.writeFileSync(`${__dirname}/../db/users.json`, JSON.stringify(users,null,"\t"));
								var user = users[email.toLowerCase()];
								req.session.loggedIn = true;
								req.session.user = { id: user.id, email: user.email };
								res.send({ status: 200, user: { id: user.id, email: user.email, createdAt: user.createdAt }, msg: "User created." });
							}));
						} else {
							res.send({ status: 422, msg: "Invalid password. Required: Upper & lowercase, 8+ characters, at least one number/symbol." });
						}
					} else {
						res.send({ status: 422, msg: "Invalid email." });
					}
				}
			} else {
				res.send({ status: 422, msg: "Missing password." });
			}
		} else {
			res.send({ status: 422, msg: "Missing email." });
		}
	} else {
		res.send({ status: 500, msg: "User db was not found, please contact site owner." });
	}
});

router.post("/login", (req, res) => {
	users = JSON.parse(fs.readFileSync(`${__dirname}/../db/users.json`, "utf8"));

	var body = req.body;
	var email = body.email;
	var pass = body.pass;

	if(users) {
		if(email) {
			if(pass) {
				if(users[email.toLowerCase()]) {
					var user = users[email.toLowerCase()];
					bcrypt.compare(pass, user.pass, (err, result) => {
						if(err) return console.log(err);
						if(result == false) return res.send({ status: 422, msg: "Incorrect password." });
						req.session.loggedIn = true;
						req.session.user = { id: user.id, email: user.email };
						res.send({ status: 200, msg: "Logged in, redirecting..." });
					});
				} else {
					res.send({ status: 404, msg: "User was not found." });
				}
			} else {
				res.send({ status: 422, msg: "Missing password." });
			}
		} else {
			res.send({ status: 422, msg: "Missing email." });
		}
	} else {
		res.send({ status: 500, msg: "User db was not found, please contact site owner." });
	}
});

module.exports = router;