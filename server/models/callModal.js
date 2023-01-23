var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const callSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: "user"}],
  caller: { type: Schema.Types.ObjectId, ref: "user" },
  recipient: { type: Schema.Types.ObjectId, ref: "user" },
  type: { type: String, default: "video" },
  status: { type: String },
  duration:{type:String, default:''},
  timestamps: { type: Date, default: new Date(Date.now()) },
});


module.exports = mongoose.model("call", callSchema, "calls");
