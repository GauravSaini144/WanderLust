const User=require("../models/user.js");


module.exports.signupForm=(req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.signup=async(req,res)=>{
    try{
    let {username,email, password}=req.body;
    const newUser=new User({email, username});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.logIn(registeredUser,(err)=>{
        if(err){
        return next(err);
        }
    req.flash("success","Signed Up Successfully");
    res.redirect("/listing");

    });
}
    catch(e){
        req.flash("error","Username already used, Try Different One!");
        res.redirect("/signup");
    }
}

module.exports.loginForm=(req,res)=>{
    res.render("user/login.ejs");
}

module.exports.loginUser=async (req,res)=>{
 
    let redirectUrl=res.locals.redirectUrl||"/listing";
req.flash("success","welcome logged In");
res.redirect(redirectUrl);

}

module.exports.logoutUser=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are Logged Out");
        res.redirect("/listing");
    });
}