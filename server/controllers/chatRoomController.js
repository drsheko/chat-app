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
    try{    console.log('myID1', chatId)
        var chatRoom = ChatRoom.findById(chatId)
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