var mongoose = require('mongoose');
var User = require('../models/userModel')
var ChatRoom =require('../models/chatRoomModel');
var Message = require('../models/messageModel');

exports.initiateChat = async(req,res) => {
   var userIds = req.body.userIds
    try{
        var chatRoom =await ChatRoom.initiateChat(userIds)
        return res.status(200).json({ success: true, chatRoom });}
    catch(error){
        return res.status(500).json({success:false,error})
    }
}

exports.get_chatRoomByRoomId = async(req,res) => {
    var chatId =req.body.roomId;
    try{    
        var chatRoom = ChatRoom.findById(chatId)
            .populate({
                path:'messages',
                populate:{
                    path:'postedBy'
                }
            })
           .exec( (error,room)=>{
                if (error){  return res.status(500).json({success:false, error})
                   
                } 
                return res.status(200).json({success:true, room})
            })

       /* var chatRoom = await ChatRoom.getChatRoomByRoomId(chatId);
        return res.status(200).json({success:true, chat})*/
    }
    catch(error){
        return res.status(500).json({success:false, error})
    }
}

exports.getAllChatRoomsByUserId = async(req,res) => {
    var userId = req.params.userid;
    try{
        var rooms = await ChatRoom.getChatRoomsByUserId(userId);
        res.status(200).json({success:true, rooms})
    }
    catch(error){
        res.status(500).json({success:false, error})
    }
}
