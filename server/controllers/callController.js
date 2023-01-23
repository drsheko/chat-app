const User = require("../models/userModel");
const Call = require("../models/callModal");
const mongoose = require("mongoose");

exports.create_call = async (req, res) => {
  console.log(req.body);
  let caller = req.body.caller;
  let recipient = req.body.recipient;
  let status = req.body.status;
  let duration = req.body.duration;
  var newCall = new Call({
    users: [caller, recipient],
    caller,
    recipient,
    status,
    duration,
  });
  newCall.save((error, call) => {
    if (error) {
      return res.status(401).json({ success: false, error });
    }

    User.updateMany(
      {
        $or: [{ _id: caller }, { _id: recipient }],
      },
      {
        $push: {
          calls: call._id,
        },
      }
    ).exec((error, users) => {
      if (error) {
        return res.status(401).json({ success: fasle, error });
      }
      return res.status(200).json({ success: true, users });
    });
  });
};
exports.cancelled_call = async (req, res) => {
  console.log(req.body);
  let caller = req.body.caller;
  let recipient = req.body.recipient;
  let status = req.body.status;
  var newCall = new Call({
    users: [caller, recipient],
    caller,
    recipient,
    status,
  });
  newCall.save((error, call) => {
    if (error) {
      return res.status(401).json({ success: false, error });
    }
    User.findByIdAndUpdate(caller, {
      $push: {
        calls: call._id,
      },
    }).exec((error, user) => {
      if (error) {
        return res.status(401).json({ success: false, error });
      }
      return res.status(200).json({ success: true, user });
    });
  });
};

exports.getCalls_By_USER_Id = async (req, res) => {
  let userId = req.body.userId;

  User.findById(userId, 'calls')
    .populate("calls")
    .populate({
      path: "calls",
      populate: [{ path: "recipient" }, { path: "caller" }]
    })
    .exec((error, user) => {
      if (error) {
        return res.status(401).json({ success: false, error });
      }
      return res.status(200).json({ success: true, calls: user.calls });
    });
};
