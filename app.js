if(process.env.NODE_ENV !="production"){

    require("dotenv").config();
    
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public"))); 
 

let UrlDB=process.env.ATLAS_URL;

main().then(()=>{
    console.log("connected to database");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(UrlDB);

}

const store=MongoStore.create({
mongoUrl:UrlDB,
crypto:{
    secret:process.env.SECRET,
},
touchAfter:24*3600,
});

store.on("error",(err)=>{
console.log("Error in Mongo session",err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveuninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

app.use("/listing",listings);
app.use("/listing/:id/reviews",reviews);
app.use("/",userRouter);


app.listen(8080,()=>{
    console.log("server is starting");
});
app.get("/",async(req,res)=>{
    let allListing=await Listing.find({});
    res.render("listings/index.ejs",{allListing});
})


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not found "));
});


app.use((err,req,res,next)=>{
    let{statusCode=500, message="Somthing went wrong"}=err;
    res.status(statusCode).render("listings/error.ejs",{err});
    
});

