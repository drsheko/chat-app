const router = require("express").Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const chatRoomController = require('../controllers/chatRoomController')

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
router.post('/api/users/user', userController.get_USER_BY_userID)

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



module.exports = router;
