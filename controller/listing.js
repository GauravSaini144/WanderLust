const Listing=require("../models/listing.js")

module.exports.index=async (req,res)=>{
    const allListing=await Listing.find({});
    res.render("listings/index.ejs",{allListing});
}
module.exports.newForm=(req,res)=>{
         
    res.render("listings/new.ejs");
}

module.exports.createNew=async(req,res,next)=>{

    let url=req.file.path;
    let filename=req.file.filename;
    
      
    const newListing = new Listing(req.body);
    newListing.image={url, filename};
    newListing.owner=req.user._id;
    newListing.category=req.body.category;
  await newListing.save();
 
    
   req.flash("success","New Listing Created!");
      res.redirect("/listing");  
    }

module.exports.editForm=async (req,res)=>{
    let  {id}=req.params;
    let list=await Listing.findById(id);
    if(!list){
        req.flash("error","Listing You Requested For Does Not Exist");
        res.redirect("/listing");
    }
    let orignalUrl=list.image.url;
    console.log(orignalUrl);
    orignalUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{list, orignalUrl});

}

module.exports.update=async (req,res,next)=>{
       
    let  {id}=req.params;
    let {title,description,price,image,location,country}=req.body;
    
    let listing= await Listing.findByIdAndUpdate(id,{title:title,description:description,price:price,image:image,location:location,country:country});
    if(typeof req.file!="undefined"){
        let url=req.file.path;
       let filename=req.file.filename;
       listing.image={url,filename};
       listing.save();
    }
    req.flash("success","Listing Updated successfully!");
    res.redirect("/listing");
   
}

module.exports.destroy=async (req,res)=>{
    let {id}=req.params;
    let deleteList= await Listing.findByIdAndDelete(id);
    console.log(deleteList);
    req.flash("success","Listing deleted successfully");
    res.redirect("/listing");
}

module.exports.rooms=async(req,res)=>{
    
        const allListing=await Listing.find({category:"Rooms"});
        res.render("listings/index.ejs",{allListing});
    
}

module.exports.beach=async(req,res)=>{
    
    const allListing=await Listing.find({category:"Beach"});
    res.render("listings/index.ejs",{allListing});

}

module.exports.iconic_cities=async(req,res)=>{
    
    const allListing=await Listing.find({category:"Iconic_cities"});
    res.render("listings/index.ejs",{allListing});

}

module.exports.farms=async(req,res)=>{
    
    const allListing=await Listing.find({category:"Farms"});
    res.render("listings/index.ejs",{allListing});

}

module.exports.arctic=async(req,res)=>{
    
    const allListing=await Listing.find({category:"Arctic"});
    res.render("listings/index.ejs",{allListing});

}

module.exports.castles=async(req,res)=>{
    
    const allListing=await Listing.find({category:"Castles"});
    res.render("listings/index.ejs",{allListing});

}

module.exports.mountains=async(req,res)=>{
    
    const allListing=await Listing.find({category:"Mountains"});
    res.render("listings/index.ejs",{allListing});

}

module.exports.showSingleList=async (req,res)=>{
    let {id} =req.params;
    let singleList=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!singleList){
        req.flash("error","Listing You Requested For Does Not Exist");
        res.redirect("/listing");
    }
    res.render("listings/show.ejs",{singleList});
   
    console.log(singleList);
}
    
