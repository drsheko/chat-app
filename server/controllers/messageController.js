var mongoose = require('mongoose');
var User = require('../models/userModel')
var ChatRoom =require('../models/chatRoomModel');
var Message = require('../models/messageModel');

exports.create_message = async(req,res) => {
    var chatId = req.body.chatId;
    var message = req.body.message;
    var sender = req.body.sender
  
       var newMessage = new Message({
        chatRoom:chatId,
        message:message,
        postedBy:sender,
        readByRecipients:{readBy:sender},
       })
       newMessage.save((err,msg)=>{
        if(err){return res.status(500).json({success:false, err})}
        else{
            ChatRoom.findByIdAndUpdate(msg.chatRoom, {
                $push: {
                    messages:msg
                }
            },(err)=>{
                if(err){
                    return res.status(500).json({success:false, err})
                }   
            })
            return res.status(200).json({success:true, msg})
        }
       })  
}

exports.mark_AllRoomMessages_AsRead_ByUser = async(req,res) => {
    var userId = req.body.userId;
    var roomId = req.body.chatRoomId;
    Message.updateMany({
        chatRoom:roomId,
        'readByRecipients.readBy':{
                $ne:userId
            }
        },
        {
                $push:{
                    readByRecipients:{
                        readBy:userId,
                        at:new Date()
                    }
                }    
        })
        .exec((error, msgs) => {
            if(error) {
                return res.status(500).json({success:false, error})
            }else{
                return res.status(200).json({success:true, msgs})
            }
        })
        
}

exports.get_unreadMessages = async(req, res) => {
    var userId = req.body.userId;
    var roomId = req.body.chatRoomId;
    Message.find({
        chatRoom:roomId,
        'readByRecipients.readBy':{
                $ne:userId
            }
        })
        .exec((err, msgs)=>{
            if(err){
                res.status(500).json({success:false, err})
            }else{
                res.status(200).json({success:true, msgs})
            }

        })
}