var mongoose = require('mongoose');
var User = require('../models/userModel')
var ChatRoom =require('../models/chatRoomModel');
var Message = require('../models/messageModel');

exports.create_message = async(req,res) => {
    console.log(req.body)
    var chatId = req.body.chatId;
    var message = req.body.message;
    var sender = req.body.sender
    
       // var message = await Message.createMessage(chatId, message, sender)
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