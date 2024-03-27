const Listing=require("./models/listing.js");
const Review=require("./models/review.js");

module.exports.isLoggedin=(req,res,next)=>{
         
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","Login Required");
       return res.redirect("/login");
        
      }
      next();
};
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error"," You Don't have permission to update");
        return res.redirect("/listing");
    }
    next();
}

module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id, reviewId}=req.params;
    let review= await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","Don't have permission");
        return res.redirect(`/listing/${id}`);
    }
    next();
}