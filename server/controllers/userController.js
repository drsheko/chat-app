const User = require("../models/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const { ref, uploadBytes, listAll, deleteObject } = require("firebase/storage");
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
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),

  async (req, res, next) => {
    //upload
    var uploadedFileURL;
    const file = req.file;
    const fileName = file.originalname + new Date();
    const imageRef = ref(storage, fileName);
    const metatype = { contentType: file.mimetype, name: file.originalname };
    await uploadBytes(imageRef, file.buffer, metatype)
      .then((snapshot) => {
        uploadedFileURL = `https://firebasestorage.googleapis.com/v0/b/${snapshot.ref._location.bucket}/o/${snapshot.ref._location.path_}?alt=media`;
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
        .json({ errors: ["Username is aleardy taken !!"], form });
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
  var userId =req.body.userId;
  User.find(
    {
      username:{$regex:search,$options:'$i'},
      _id:{$ne:userId}
    })
    .exec((error, result) => {
      if(error){
        return res.status(401).json({success:false, error})
      }
      return res.status(200).json({success:true, result})
    })
    
};

exports.Add_friend = (req, res) => {
  var userId = req.params.userid;
  var contactId = req.params.contactid;
  User.findByIdAndUpdate(
    userId,{
      $addToSet: {
        friends: contactId,
      }
    },{new:true}
  )
  .exec(
    (err,user) => {
      if (err) {
        return res.status(401).json({ error: err });
      } else {
        User.findById(contactId, (err, addedFriend) => {
          if (err) {
            return res.status(401).json({ success: false, err });
          } else {
            return res.status(200).json({ success: true, addedFriend ,user});
          }
        });
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
  console.log(req.body);
  var id = req.body.userId;
  User.findById(id, (error, user) => {
    if (error) {
      return res.status(401).json({ success: false, error });
    } else {
      return res.status(200).json({ success: true, user });
    }
  });
};

exports.switch_To_Online_ByUserId = async (req, res) => {
  var userId = req.body.userId;
  User.findByIdAndUpdate(userId, {
    $set: {
      isOnline: true,
    },
  },{new:true}).exec((err, user) => {
    if (err) {
      return res.status(401).json({ success: false, err });
    }
    return res.status(200).json({ success: true, user });
  });
};
exports.switch_To_offline_ByUserId = async (req, res) => {
  var userId = req.body.userId;
  User.findByIdAndUpdate(userId, {
    $set: {
      isOnline: false,
    },
  },{new:true}).exec((err, user) => {
    if (err) {
      return res.status(401).json({ success: false, err });
    }
    return res.status(200).json({ success: true, user });
  });
};
exports.change_Profile_Info = (req, res) => {
  let userId = req.body.userId;
  let username = req.body.username;
  User.findByIdAndUpdate(userId, {
    $set: {
      username: username,
    }
  },{new:true}).exec((err, user) => {
    if (err) {
      return res.status(401).json({ success: false, err });
    }
    return res.status(200).json({ success: true, user });
  });
};

exports.changePassword = (req, res) => {
  let userId = req.body.userId;
  let oldPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;
  User.findById(userId, (error, user) => {
    if (error) {
      return res.status(401).json({ success: false, error });
    }
    if (user) {
      bcrypt.compare(oldPassword, user.password, (error, response) => {
        if (error) {
          return res.status(401).json({ success: false, error });
        }
        if (!response) {
          return res
            .status(200)
            .json({ success: false, error: "Incorrect password!!" });
        }
        if (response) {
          bcrypt.hash(newPassword, 10, (error, hash) => {
            if (error) {
              return res.status(401).json({ success: false, error });
            } else {
              User.findByIdAndUpdate(userId, {
                $set: {
                  password: hash,
                },
              },{new:true}).exec((error, user) => {
                if (error) {
                  return res.status(401).json({ success: false, error });
                } else {
                  return res.status(200).json({ success: true , user});
                }
              });
            }
          });
        }
      });
    }
  });
};

exports.upload_Profile_Picture = [
  upload.single("avatar"),
  async (req, res) => {
    var uploadedFileURL;
    var userId = req.body.userId;
    const file = req.file;
    const fileName = file.originalname + new Date();
    const imageRef = ref(storage, fileName);
    const metatype = { contentType: file.mimetype, name: file.originalname };
    await uploadBytes(imageRef, file.buffer, metatype)
      .then((snapshot) => {
        uploadedFileURL = `https://firebasestorage.googleapis.com/v0/b/${snapshot.ref._location.bucket}/o/${snapshot.ref._location.path_}?alt=media`;
        User.findByIdAndUpdate(userId, {
          $set: {
            avatarURL: uploadedFileURL
          },
          $push:{
            "pictures.uploads":uploadedFileURL
          }
        },{new:true}).exec((error, user) => {
          if (error) {
            return res.status(401).json({ success: false, error });
          }
          return res
            .status(200)
            .json({ success: true, user });
        });
      })
      .catch(error => {
        return res.status(401).json({success:false, error:error.message})
      });
  },
];

exports.Change_Profile_Picture = async(req, res) => {
  let userId = req.body.userId;
  let photo = req.body.photoURL ;
  User.findByIdAndUpdate(userId,{
    $set:{
      avatarURL:photo
    },
    $addToSet:{
    'pictures.uploads':photo
    }
  },{new:true})
  .exec((error, user) => {
    if(error){
      return res.status(401).json({success:false, error})
    }
    return res.status(200).json({success:true,user})
  })
}

exports.Remove_photo_from_Gallery = async(req, res) => {
  var userId = req.body.userId;
 const removedPhoto = req.body.photoURL;
  const photoType = req.body.photoType;

  User.findByIdAndUpdate(userId,{
    $pull:  {
       [`pictures.${photoType}`]:removedPhoto
    }
  },{new:true})
  .exec((error, user) =>{
    if(error){
      return res.status(401).json({success:false, error})
    }
    return res.status(200).json({success:true, user})
  })
}

exports.unFollow_Friend =async (req, res) => {
  console.log(req.body)
  var userId = req.body.userId;
  var friendId = req.body.friendId;

  User.findByIdAndUpdate(userId,{
    $pull:{
      'friends':friendId,
    }
  },{new:true})
  .exec((error, user) => {
    if(error){
      return ress.status(401).json({success:false, error})
    }
    return res.status(200).json({success:true, user})
  })
}
