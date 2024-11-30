const mongoose = require("mongoose");

port="mongodb://127.0.0.1:27017"
mongoose.connect(`${port}/authsetup`).then(()=>{
    console.log("connected to database")
}).catch((error)=>{
    console.log(error.message)
})


const userSchema = mongoose.Schema({
    username:String,
    password:String,
    email:String,
    age:Number,
});
module.exports = mongoose.model("user",userSchema);