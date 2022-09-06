const router = require("express").Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router.get("/", function (req, res, next) {
  res.render("home");
});
// sign-up  (Create an account)
router.post("/api/sign-up", userController.signup_post);

// login
router.post("/api/login", authController.login_post);

// logout
router.get("/api/logout", authController.log_out);

// search Contacts 
router.post('/api/contacts' , userController.search_Contacts);

//add Friend 
router.post('/api/:userid/:contactid', userController.Add_friend)
module.exports = router;
