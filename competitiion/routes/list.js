var express = require("express");
var router = express.Router();
var fetch = require("cross-fetch")
var express = require("express");
var router = express.Router();


router.get("/", function (req, res, next) {

  const users = req.app.locals.users;

  users.find().toArray((err, recent) => {
    
    for (let i = 0; i < recent.length; i++) {
      if (err) {
        console.error(err);
      }

      const userting = recent[i].username
      var url = "https://api.github.com/users/" + userting + "/repos";
      console.log(url);
      if (url === "https://api.github.com/users/undefined/repos") {
        myFunction(userting);
        async function myFunction() {
          const filter = { username: userting };
          const update = { $set: { repos: "No repos" } };
          await users.findOneAndUpdate(filter, update);
        }
      }
      else {
        var jsonData = fetch(url)
          .then(res => res.json())
          .then(out => {
            const ting = out.length;

            console.log(ting)
            myFunction(ting, userting);
            async function myFunction() {
              const filter = { username: userting };
              const update = { $set: { repos: ting } };
              await users.findOneAndUpdate(filter, update);
            }

          }).catch(err => console.log(err));
      }
    }

    res.render("../views/list.hbs", { recent });
  });
  users.find().toArray((err, recent) => {

    for (let i = 0; i < recent.length; i++) {
      if (err) {
        console.error(err);
      }

      const CodeWarsusername = recent[i].codewarsusername
      var url = "https://www.codewars.com/api/v1/users/" + CodeWarsusername
      console.log(url);
      if (url === "https://www.codewars.com/api/v1/users/undefined") {
        console.log("undefined wrong")
        myFunction(CodeWarsusername);
        async function myFunction() {
          const filter = { codewarsusername: CodeWarsusername };
          const update = { $set: { Codescore: "No Account" } };
          await users.findOneAndUpdate(filter, update);

        }
      }
      else {
        var jsonData = fetch(url)
          .then(res => res.json())
          .then(out => {
            const Codescore = out.ranks.overall.score;
            console.log(Codescore)
            myFunction(Codescore, CodeWarsusername);
            async function myFunction() {
              const filter = { codewarsusername: CodeWarsusername };
              const update = { $set: { Codescore: Codescore } };
              await users.findOneAndUpdate(filter, update);

            }

          }).catch(err => console.log(err));
      }
    }

    res.render("../views/list.hbs", { recent });
  });


});

module.exports = router;
