import { Router } from "express";
const sessions = Router ();

import passport from "passport";


sessions.post ('/login', passport.authenticate('login'),async (req,res)=>{
    try {
		req.session.user = {
			first_name: req.user.first_name,
			last_name: req.user.last_name,
			email: req.user.email,
			role: req.user.role,
		};
		return res.status(200).send({status: 'success', response: 'User loged'});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});
sessions.post("/register", passport.authenticate("register"), async (req, res) => {
	try {
		req.session.user = {
			first_name: req.user.first_name,
			last_name: req.user.last_name,
			email: req.user.email,
			role: req.user.role,
		};
		return res.status(200).send({status: 'success', response: 'User created'});
	} catch (err) {
		return res.status(500).json({ status: 'error', response: err.message });
	};
});


sessions.post("/logout", (req, res) => {
	try {
		req.session.destroy((err) => {
			if (!err) {
				return res.status(200).render("login", {
					style: "styles.css",
					documentTitle: "Login",
				});
			};

			return res.status(500).send({ status: `Logout error`, payload: err });
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

sessions.get("/github", passport.authenticate("github"), async (req, res) => {});

sessions.get("/githubCallback", passport.authenticate("github"), async (req, res) => {
	req.session.user = req.user;
	res.redirect("/");
});

export default sessions;