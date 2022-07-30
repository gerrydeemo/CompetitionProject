var express = require("express");
var router = express.Router();
const ObjectID = require("mongodb").ObjectID;

router.get("/", function (req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect("/auth/login");
  }
  const users = req.app.locals.users;
  const _id = ObjectID(req.session.passport.user);

  users.findOne({ _id }, (err, results) => {
    if (err) {
      throw err;
    }

    res.render("account", { ...results });
  });
});

router.get("/:username", (req, res, next) => {
  const users = req.app.locals.users;
  const username = req.params.username;

  users.findOne({ username }, (err, results) => {
    if (err || !results) {
      res.render("public-profile", { messages: { error: ["User not found"] } });
    }

    res.render("public-profile", { ...results, username });
  });
});

router.post("/", (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect("/auth/login");
  }
  const users = req.app.locals.users;
  const { firstname, lastname, github, email, emstatus, phonenumber } =
    req.body;
  const _id = ObjectID(req.session.passport.user);

  users.updateOne(
    { _id },
    { $set: { firstname, lastname, github, email, emstatus, phonenumber } },
    (err) => {
      if (err) {
        throw err;
      }

      res.redirect("/users");
    }
  );


});

module.exports = router;
