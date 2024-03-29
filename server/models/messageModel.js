var mongoose = require('mongoose')
var Schema = mongoose.Schema;

const readByRecipientSchema = new Schema({
  _id:false,
  readBy:{type:mongoose.Types.ObjectId, ref:'user'},
  at:{type:Date, default:new Date()}
})
  
  const messageSchema = new Schema(
    {
      chatRoom: { type: Schema.Types.ObjectId, ref: "chatRoom"},
      message: mongoose.Schema.Types.Mixed,
      postedBy: { type: Schema.Types.ObjectId, ref: "user"},
      timestamp:{type: Date, default: Date.now},
      type:{type:String, default:'text'},
      readByRecipients: [readByRecipientSchema],
    }
  );
  

  messageSchema.statics.createMessage = async(chatRoom, message, postedBy) => {
    try{
      const message = await this.create({
        chatRoom,
        message,
        postedBy,
       // readByRecipients: { 'readByUserId': postedBy }
      })
      return room
    }
    catch(error){
      throw error;
    }
  }
  messageSchema.statics.UpdateMessage = async() => {
    Message.updateMany({},{
      $set:{'type':'text'}
    })
  }
  messageSchema.statics.createPostInChatRoom = async function (chatRoom, message, postedBy) {
    try {
      const post = await this.create({
        chatRoom,
        message,
        postedBy,
        readByRecipients: { readByUserId: postedBy }
      });
      const aggregate = await this.aggregate([
        // get post where _id = post._id
        { $match: { _id: post._id } },
        // do a join on another table called users, and 
        // get me a user whose _id = postedByUser
        {
          $lookup: {
            from: 'users',
            localField: 'postedByUser',
            foreignField: '_id',
            as: 'postedByUser',
          }
        },
        { $unwind: '$postedByUser' },
        // do a join on another table called chatrooms, and 
        // get me a chatroom whose _id = chatRoomId
        {
          $lookup: {
            from: 'chatrooms',
            localField: 'chatRoomId',
            foreignField: '_id',
            as: 'chatRoomInfo',
          }
        },
        { $unwind: '$chatRoomInfo' },
        { $unwind: '$chatRoomInfo.userIds' },
        // do a join on another table called users, and 
        // get me a user whose _id = userIds
        {
          $lookup: {
            from: 'users',
            localField: 'chatRoomInfo.userIds',
            foreignField: '_id',
            as: 'chatRoomInfo.userProfile',
          }
        },
        { $unwind: '$chatRoomInfo.userProfile' },
        // group data
        {
          $group: {
            _id: '$chatRoomInfo._id',
            postId: { $last: '$_id' },
            chatRoomId: { $last: '$chatRoomInfo._id' },
            message: { $last: '$message' },
            type: { $last: '$type' },
            postedByUser: { $last: '$postedByUser' },
            readByRecipients: { $last: '$readByRecipients' },
            chatRoomInfo: { $addToSet: '$chatRoomInfo.userProfile' },
            createdAt: { $last: '$createdAt' },
            updatedAt: { $last: '$updatedAt' },
          }
        }
      ]);
      return aggregate[0];
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * @param {String} chatRoomId - chat room id
   */
  messageSchema.statics.getConversationByRoomId = async function (chatRoomId, options = {}) {
    try {
      return this.aggregate([
        { $match: { chatRoomId } },
        { $sort: { createdAt: -1 } },
        // do a join on another table called users, and 
        // get me a user whose _id = postedByUser
        {
          $lookup: {
            from: 'users',
            localField: 'postedByUser',
            foreignField: '_id',
            as: 'postedByUser',
          }
        },
        { $unwind: "$postedByUser" },
        // apply pagination
        { $skip: options.page * options.limit },
        { $limit: options.limit },
        { $sort: { createdAt: 1 } },
      ]);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * @param {String} chatRoomId - chat room id
   * @param {String} currentUserOnlineId - user id
   */
  messageSchema.statics.markMessageRead = async function (chatRoomId, currentUserOnlineId) {
    try {
      return this.updateMany(
        {
          chatRoomId,
          'readByRecipients.readByUserId': { $ne: currentUserOnlineId }
        },
        {
          $addToSet: {
            readByRecipients: { readByUserId: currentUserOnlineId }
          }
        },
        {
          multi: true
        }
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * @param {Array} chatRoomIds - chat room ids
   * @param {{ page, limit }} options - pagination options
   * @param {String} currentUserOnlineId - user id
   */
messageSchema.statics.getRecentConversation = async function (chatRoomIds, options, currentUserOnlineId) {
    try {
      return this.aggregate([
        { $match: { chatRoomId: { $in: chatRoomIds } } },
        {
          $group: {
            _id: '$chatRoomId',
            messageId: { $last: '$_id' },
            chatRoomId: { $last: '$chatRoomId' },
            message: { $last: '$message' },
            type: { $last: '$type' },
            postedByUser: { $last: '$postedByUser' },
            createdAt: { $last: '$createdAt' },
            readByRecipients: { $last: '$readByRecipients' },
          }
        },
        { $sort: { createdAt: -1 } },
        // do a join on another table called users, and 
        // get me a user whose _id = postedByUser
        {
          $lookup: {
            from: 'users',
            localField: 'postedByUser',
            foreignField: '_id',
            as: 'postedByUser',
          }
        },
        { $unwind: "$postedByUser" },
        // do a join on another table called chatrooms, and 
        // get me room details
        {
          $lookup: {
            from: 'chatrooms',
            localField: '_id',
            foreignField: '_id',
            as: 'roomInfo',
          }
        },
        { $unwind: "$roomInfo" },
        { $unwind: "$roomInfo.userIds" },
        // do a join on another table called users 
        {
          $lookup: {
            from: 'users',
            localField: 'roomInfo.userIds',
            foreignField: '_id',
            as: 'roomInfo.userProfile',
          }
        },
        { $unwind: "$readByRecipients" },
        // do a join on another table called users 
        {
          $lookup: {
            from: 'users',
            localField: 'readByRecipients.readByUserId',
            foreignField: '_id',
            as: 'readByRecipients.readByUser',
          }
        },
  
        {
          $group: {
            _id: '$roomInfo._id',
            messageId: { $last: '$messageId' },
            chatRoomId: { $last: '$chatRoomId' },
            message: { $last: '$message' },
            type: { $last: '$type' },
            postedByUser: { $last: '$postedByUser' },
            readByRecipients: { $addToSet: '$readByRecipients' },
            roomInfo: { $addToSet: '$roomInfo.userProfile' },
            createdAt: { $last: '$createdAt' },
          },
        },
        // apply pagination
        { $skip: options.page * options.limit },
        { $limit: options.limit },
      ]);
    } catch (error) {
      throw error;
    }
  }
  
  module.exports =  mongoose.model("message", messageSchema, 'messages');