var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const chatRoomSchema = new Schema(
  {
    userIds:[{ type: Schema.Types.ObjectId, ref: "user", default: []}],
    timestamps: {type : Data, default: new Date()}
  }
);


chatRoomSchema.statics.getChatRoomsByUserId = async function (userId) {
  try {
    const rooms = await this.find({ userIds: { $all: [userId] } });
    return rooms;
  } catch (error) {
    throw error;
  }
}


chatRoomSchema.statics.getChatRoomByRoomId = async function (roomId) {
  try {
    const room = await this.findOne({ _id: roomId });
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
    });
    if (availableRoom) {
      return {
        isNew: false,
        message: 'retrieving an old chat room',
        chatRoomId: availableRoom._doc._id,
   
      };
    }
    const newRoom = await this.create({ userIds });
    return {
      isNew: true,
      message: 'creating a new chatroom',
      chatRoomId: newRoom._doc._id,
    };
  } catch (error) {
    console.log('error on start chat method', error);
    throw error;
  }
}

module.exports =  mongoose.model('chatRoom', chatRoomSchema, 'chatRooms')