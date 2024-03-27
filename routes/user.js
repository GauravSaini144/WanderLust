const express=require("express");
const router=express.Router({mergeParams:true});
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controller/user.js");

// render signup form
router.get("/signup",(userController.signupForm)); 
// signup user and login
router.post("/signup",wrapAsync(userController.signup));

// render login form 
router.get("/login",(userController.loginForm));

// login user
router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),(userController.loginUser));

//logout user
router.get("/logout",(userController.logoutUser));

module.exports=router;