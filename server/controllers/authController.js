const passport = require("passport");
const mongoose = require("mongoose");

exports.login_post = function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return res.status(401).json({ errors: err });
    }
    if (!user) {
      return res.status(401).json({ errors: info });
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.status(401).json({ errors: err });
      }
      return res.json({ user });
    });
  })(req, res, next);
};

exports.log_out = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.json({ errors: err });
    }
    var msg = "Log out successfully";
    res.json({ success: msg });
  });
};


