const express=require("express");
const router=express.Router({mergeParams:true});
const Review=require("../models/review.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const { isLoggedin, isReviewAuthor } = require("../middleware.js");
const reviewController=require("../controller/review.js");





const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
};
// Post route  for review
router.post("/",isLoggedin,validateReview ,wrapAsync(reviewController.createReview));
    
    // delete route for reviews
router.delete("/:reviewId",isLoggedin,isReviewAuthor,wrapAsync(reviewController.destroyreview));
    module.exports=router;