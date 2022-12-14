const User = require("../models/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const {
  ref,
  uploadBytes,
  listAll,
  deleteObject,
} = require("firebase/storage");
const storage = require("../firebase");

const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });


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
    //upload
    var uploadedFileURL
    const file = req.file;
    const fileName = file.originalname+new Date()
  const imageRef = ref(storage, fileName);
  const metatype = { contentType: file.mimetype, name: file.originalname };
  await uploadBytes(imageRef, file.buffer, metatype)
    .then((snapshot) => {
     uploadedFileURL = `https://firebasestorage.googleapis.com/v0/b/${snapshot.ref._location.bucket}/o/${snapshot.ref._location.path_}?alt=media`
    
    })
    .catch((error) => console.log(error.message));

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
            uploaded_Url = uploadedFileURL;
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
  var search = req.body.search;
  User.find(
    {
      $text: { $search: search },
    },
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      } else {
        return res.json({ result });
      }
    }
  );
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
        return res.status(500).json({ error: err });
      } else {
        User.findById(contactId,
          (err,addedFriend) => {
            if(err){
              return res.status(500).json({success:false, err})
            }else{
              return res.status(200).json({success:true, addedFriend})
            }
          }
          )
       ;
      }
    }
  );
};

exports.get_USER_Friends = (req, res) => {
  var userId = req.params.userid;
  User.findById(userId, { friends: 1 })
    .populate({
      path: "friends",
    })
    .exec((err, data) => {
      if (err) {
        return res.status(401).json({ errors: err });
      } else {
        return res.json({ friends: data.friends });
      }
    });
};

exports.get_USER_BY_userID = async (req, res) => {
  console.log(req.body)
  var id = req.body.userId;
  User.findById(id, (error, user) => {
    if (error) {
      return res.status(500).json({ success: false, error });
    } else {
      return res.status(200).json({ success: true, user });
    }
  });
};

exports.switch_To_Online_ByUserId = async(req,res) => {
  var userId = req.body.userId
  User.findByIdAndUpdate(userId,{
    $set:{
      isOnline:true
    }
  })
  .exec((err,user)=>{
    if(err){
      return res.status(401).json({success:false, err})
    }
    return res.status(200).json({success:true, user})
  })
}
