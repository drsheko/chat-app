const router = require("express").Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const chatRoomController = require('../controllers/chatRoomController')
const messageController = require('../controllers/messageController');
const uploadController = require('../controllers/uploadController')
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

// switch user to be Online 
router.put('/api/user/user-online', userController.switch_To_Online_ByUserId);


// search Contacts 
router.post('/api/contacts-search' , userController.search_Contacts);

//add Friend 
router.post('/api/:userid/:contactid', userController.Add_friend);

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

// Mark all chatRoom`s messages as READ by user
router.post('/api/messages/chatRoom/mark-read', messageController.mark_AllRoomMessages_AsRead_ByUser)
module.exports = router;
