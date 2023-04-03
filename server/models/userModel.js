var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, minLength: 3, required: true },
  password: { type: String, minLength: 6, required: true },
  avatarURL: { type: String, default: "unkownUserDefault.webp" },
  isOnline : { type: String, default: false},
  friends: [{ type: Schema.Types.ObjectId, ref: "user", default: []}],
  calls :  [{ type: Schema.Types.ObjectId, ref: "call", default: []}],
  pictures: {
    "uploads":[],
    "messages":[]
  }
})


module.exports = mongoose.model("user", userSchema, "users");
