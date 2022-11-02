var mongoose = require('mongoose');
var User = require('../models/userModel')
var ChatRoom =require('../models/chatRoomModel');
var Message = require('../models/messageModel');
const multer = require("multer");
const {
  ref,
  uploadBytes,
  listAll,
  deleteObject,
} = require("firebase/storage");
const storage = require("../firebase");

const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });

exports.updateMessage = async(req,res) => {
    Message.updateMany({},{
        $set:{'type':'text'}
      })
      .exec((error,msgs)=>{
        if(error){return res.status(500).json({data:error})}
        else{
          return  res.status(200).json({data:'success'})
        }
      })
}
exports.uploadPhotoMsg = [
   upload.single('photoMsg'),
    async(req,res) => {
        var uploadedFileURL
        console.log(req.file)
        const file = req.file;
        
        const fileName = file.originalname+new Date()
      const imageRef = ref(storage, fileName);
      const metatype = { contentType: file.mimetype, name: file.originalname };
      await uploadBytes(imageRef, file.buffer, metatype)
        .then((snapshot) => {
         uploadedFileURL = `https://firebasestorage.googleapis.com/v0/b/${snapshot.ref._location.bucket}/o/${snapshot.ref._location.path_}?alt=media`
            return res.status(200).json({URL:uploadedFileURL})
        })
        .catch((error) => res.status(500).json({error:'shady'}));
    }
]

exports.create_message = async(req,res) => {
    var chatId = req.body.chatId;
    var message = req.body.message;
    var sender = req.body.sender
    var type = req.body.type
       var newMessage = new Message({
        chatRoom:chatId,
        message:message,
        postedBy:sender,
        readByRecipients:{readBy:sender},
        type:type
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