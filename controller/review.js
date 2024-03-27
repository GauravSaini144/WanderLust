const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

module.exports.createReview=async(req,res)=>{
    let {id}=req.params;
     let listing = await Listing.findById(req.params.id);
     let newReview=new Review(req.body.review);
     newReview.author=req.user._id;
     listing.reviews.push(newReview); 
     await newReview.save();
     await listing.save();
     console.log("Review saved")
     req.flash("success","Review Added!")
     res.redirect(`/listing/${id}`);
    }

module.exports.destroyreview=async (req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listing/${id}`);
}