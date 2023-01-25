const passport = require("passport");
const mongoose = require("mongoose");
const User = require("../models/userModel");
exports.login_post = function (req, res, next) {
  passport.authenticate("local", function (error, user, info) {
    if (error) {
      return res.status(401).json({success:false, error });
    }
    if (!user) {
      return res.status(401).json({ success:false, error: info });
    }
    req.logIn(user, function (error) {
      if (error) {
        return res.status(401).json({ success:false, error });
      } else {
        var userId = user._id;
        User.findByIdAndUpdate(
          userId,
          {
            $set: {
              isOnline: true,
            },
          },
          { new: true }
        ).exec((error, user) => {
          if (error) {
            return res.status(401).json({ success: false, error });
          }
          return res.status(200).json({ success: true, user });
        });
      }
      
    });
  })(req, res, next);
};

exports.log_out = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.json({ success: false, errors: err });
    }
    var msg = "Log out successfully";
    res.json({ success: true, msg });
  });
};
