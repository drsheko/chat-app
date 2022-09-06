const User = require("../models/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, path.join(__dirname, '/../public/images'))
    cb(null, path.join(__dirname, "/../client/src/images"));
  },
  filename: function (req, file, cb) {
    cb(null, req.body.username + file.originalname);
  },
});
const upload = multer({ storage: storage });

exports.signup_post = [
  upload.single("avatarURL"),

  body("username")
    .isString()
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Username should be at least 3 character"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .escape()
    .withMessage("Password should be at least 6 character"),
  body("confirmPassword")
    .trim()
    .isLength({ min: 6 })
    .escape()
    .withMessage("Password confirmation should match your password ")
    .custom(async (value, { req }) => {
      if (value !== req.body.password) {
        console.log(1);
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),

  async (req, res, next) => {
    var form = {
      username: req.body.username,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    };
    var errorsArr = [];
    const isUsernameTaken = await User.findOne({ username: req.body.username });
    if (isUsernameTaken != null) {
      // errorsArr.push('Username is aleardy token !!')
      return res
        .status(401)
        .json({ errors: ["Username is aleardy token !!"], form });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var errorsMsg = errors.errors.map((err) => err.msg);
      console.log(errorsMsg);
      errorsArr.push(errorsMsg);
      return res.status(401).json({ errors: errorsMsg, form });
    }
    try {
      var uploaded_Url;
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          console.log(err);
        } else {
          if (req.file) {
            uploaded_Url = req.file.filename;
          }
          var user = new User({
            username: req.body.username,
            password: hash,
            avatarURL: uploaded_Url,
          }).save((err) => {
            if (err) {
              next(err);
            }
            res.json({ success: " Account has created successfully" });
          });
        }
      });
    } catch (err) {
      return next(err);
    }
  },
];

exports.search_Contacts = async (req, res) => {
  console.log(req.body);
  var search = req.body.search;
  User.find(
    {
      $text: { $search: search },
    },
    (err, result) => {
      if (err) {
        return res.status(401).json({
          error: err,
        });
      } else {
        return res.json({ result });
      }
    }
  );
  console.log("search", search);
};

exports.Add_friend = (req, res) => {
  var userId = req.params.userid;
  var contactId = req.params.contactid;
  User.findByIdAndUpdate(
    userId,
    {
      $push: {
        friends: contactId,
      },
    },
    (err) => {
      if (err) {
        return res.status(401).json({ error: err });
      } else {
        return res.json({ success: "Friend request sent" });
      }
    }
  );
};
