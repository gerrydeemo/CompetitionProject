const express = require("express");
const router = express.Router();
const authUtils = require("../utils/auth");
const passport = require("passport");
const flash = require("connect-flash");

router.get("/login", (req, res, next) => {
  const messages = req.flash();
  res.render("login", { messages });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: "Wrong username or password",
  }),
  (req, res, next) => {
    res.redirect("/list");
  }
);

router.get("/register", (req, res, next) => {
  const messages = req.flash();
  res.render("register", { messages });
});

router.post("/register", (req, res, next) => {
  const registrationParams = req.body;
  const users = req.app.locals.users;
  const payload = {
    firstname: registrationParams.firstname,
    lastname: registrationParams.lastname,
    github: registrationParams.github,
    email: registrationParams.email,
    emstatus: registrationParams.emstatus,
    phonenumber: registrationParams.phonenumber,
    username: registrationParams.username,
    codewarsusername: registrationParams.codewarsusername,
    password: authUtils.hashPassword(registrationParams.password),
    hours: 0,
    minutes: 0,
  };

  users.insertOne(payload, (err) => {
    if (err) {
      req.flash("error", "User account already exists.");
    } else {
      req.flash("success", "User account registered successfully.");
    }

    res.redirect("/auth/register");
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
