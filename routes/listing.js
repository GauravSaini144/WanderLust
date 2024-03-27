 const express=require("express");
 const router=express.Router();
 const wrapAsync=require("../utils/wrapAsync.js");
 const ExpressError=require("../utils/ExpressError.js");
 const {listingSchema,reviewSchema}=require("../schema.js");
 const Listing=require("../models/listing.js");
 const {isLoggedin}=require("../middleware.js");
 const {isOwner}=require("../middleware.js");
 const listingController=require("../controller/listing.js");
 const multer  = require('multer')
 const {storage}=require("../cloudConfig.js");
 const upload = multer({storage});

 const validate=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
};

 // index route
router.get("/",wrapAsync(listingController.index));
    // new route
router.get("/new",isLoggedin,(listingController.newForm));
    // create route
router.post("/",isLoggedin,upload.single("imageUpload"),wrapAsync(listingController.createNew));

    // edit route
router.get("/:id/edit",isLoggedin,isOwner,(listingController.editForm));
    //update route
router.put("/:id", isOwner,upload.single("newimage"),wrapAsync(listingController.update));
    //delete route
router.delete("/:id",isLoggedin,isOwner,(listingController.destroy));

//rooms route
router.get("/rooms",(listingController.rooms));
router.get("/beach",(listingController.beach));
router.get("/farms",(listingController.farms));
router.get("/arctic",(listingController.arctic));
router.get("/iconiccities",(listingController.iconic_cities));
router.get("/castles",(listingController.castles));
router.get("/mountains",(listingController.mountains));

   // show list single..........show route
router.get("/:id",(listingController.showSingleList));

module.exports=router;