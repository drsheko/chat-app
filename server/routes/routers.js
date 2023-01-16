const router = require("express").Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const chatRoomController = require('../controllers/chatRoomController')
const messageController = require('../controllers/messageController');
const uploadController = require('../controllers/uploadController');
const callController = require('../controllers/callController');
router.get("/", function (req, res, next) {
  res.render("home");
});

// sign-up  (Create an account)
router.post("/api/sign-up", userController.signup_post);

// login
router.post("/api/login", authController.login_post);

// logout
router.get("/api/logout", authController.log_out);

// Get User by UserID 
router.post('/api/users/user', userController.get_USER_BY_userID);

// change Profile Info
router.post('/api/user/editProfile/changeInfo', userController.change_Profile_Info)
// Change Password 
router.post('/api/user/editProfile/changePassword', userController.changePassword)

// UPLOAD NEW Profile Picture
router.post('/api/user/editProfile/uploadAvatar' , userController.upload_Profile_Picture);
//Change Profile Picture 
router.post('/api/user/editProfile/changeAvatar', userController.Change_Profile_Picture);
//remove photo 
router.post('/api/user/editProfile/removePicture', userController.Remove_photo_from_Gallery)
// switch user to be Online 
router.put('/api/user/user-online', userController.switch_To_Online_ByUserId);

// switch user to be Offline 
router.put('/api/user/user-offline', userController.switch_To_offline_ByUserId);
// search Contacts 
router.post('/api/contacts-search' , userController.search_Contacts);
//remove Friend 
router.post('/api/user/removeFriend', userController.unFollow_Friend)
//add Friend 
router.post('/api/:userid/:contactid', userController.Add_friend);

router.put('/api/myuser/calls/call/update', userController.add_field)

// get User`s friends
router.post('/api/contacts/:userid/friends', userController.get_USER_Friends);

// initiate Chat
router.post('/api/rooms/chat/chat-open',chatRoomController.initiateChat)

// get chatRoom by roomId
router.post('/api/rooms/chat/active-chat',chatRoomController.get_chatRoomByRoomId)
// get all chatRooms for a user 
router.post('/api/:userid/all-rooms/join', chatRoomController.getAllChatRoomsByUserId)

// create a new message 
router.post('/api/messages/newMessage/create', messageController.create_message);
// update messageType 
router.post('/api/updateAllMessages', messageController.updateMessage)
// get unread messages 
router.post('/api/messages/all/unread', messageController.get_unreadMessages);

// upload Photo Message to Firebase
router.post('/api/messages/photo-msg/upload', messageController.uploadPhotoMsg)

// upload Voice Message to Firebase
router.post('/api/messages/voice-msg/upload', messageController.uploadVoiceMsg)
// Mark all chatRoom`s messages as READ by user
router.post('/api/messages/chatRoom/mark-read', messageController.mark_AllRoomMessages_AsRead_ByUser);

// save call to database 
router.post('/api/calls/call/saveCall', callController.create_call);
// save incomplete call to database (cancelled by caller before answer)
router.post('/api/calls/call/cancelledCall', callController.create_call);
// get User calls by user id 
router.post('/api/calls//user/mycalls', callController.getCalls_By_USER_Id);
module.exports = router;
