const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");

// Use cloud URI if available, fallback to localhost for development
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pin";
mongoose.connect(MONGODB_URI);

const userSchema = mongoose.Schema({
username : String,
name: String,
email:String,
password:String,
profileImage:String,
contact : Number,
boards:{
  type : Array,
  default:[]
},
  posts:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref :"post"
    }
  ],
  saved: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post"
    }
  ]
})
userSchema.plugin(plm);
module.exports  = mongoose.model("user" , userSchema)