const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");


main().then(()=>{
    console.log("connected to database");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const initDB=async()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"65fa9762794f91692b73e615"}));
    await Listing.insertMany(initdata.data).then((res)=>{
        console.log(res);
    }).catch((err)=>{
        console.log(err);
    });
    console.log("data was initialized");
}
initDB();