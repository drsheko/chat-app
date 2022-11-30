var mongoose = require("mongoose");
const { findById } = require("./userModel");
var Schema = mongoose.Schema;

const chatRoomSchema = new Schema(
  {
    userIds:[{ type: Schema.Types.ObjectId, ref: "user", default: []}],
    messages:[{ type: Schema.Types.ObjectId, ref: "message", default: []}],
    timestamps: {type : Date, default: new Date()}
  }
);


chatRoomSchema.statics.getChatRoomsByUserId = async function (userId) {
  try {
    const rooms = await this.find({ userIds: 
      { $all:[ userId] } })
      .populate('messages')
      .populate('userIds');
     
    return rooms;
  } catch (error) {
    throw error;
  }
}


chatRoomSchema.statics.getChatRoomByRoomId = async function (roomId) {
  try {
    const room = await this.findById({roomId});
    return room;
  } catch (error) {
    throw error;
  }
}


chatRoomSchema.statics.initiateChat = async function (userIds) {
  try {
    const availableRoom = await this.findOne({
      userIds: {
        $size: userIds.length,
        $all: [...userIds],
      }
    }).populate({
      path:'userIds'
    })
    .populate({
      path: 'messages',
      populate:{
        path:'postedBy'
      }
    });
    if (availableRoom) {
      return {
        isNew: false,
        message: 'retrieving an old chat room',
        chatRoomId: availableRoom._doc._id,
        room:availableRoom
   
      };
    }
    const newRoom = await this.create({ userIds });
    return {
      isNew: true,
      message: 'creating a new chatroom',
      chatRoomId: newRoom._doc._id,
      room:newRoom
    };
  } catch (error) {
    console.log('error on start chat method', error);
    throw error;
  }
}

module.exports =  mongoose.model('chatRoom', chatRoomSchema, 'chatRooms')