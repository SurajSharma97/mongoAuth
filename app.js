const userModel = require("./models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const express = require("express");

const app = express();


const cookieParser = require("cookie-parser");
const path = require("path");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"public")))

app.get("/",(req,res)=>{
    res.render("index")
})
app.post("/create", (req,res)=>{
    const {username, email, password,age} =req.body;
    bcrypt.genSalt(10,(err,salt)=>{
       bcrypt.hash(password,salt,async (err,hash)=>{
        let createdUser= await userModel.create({
            username,
            email,
            password:hash,
            age
        });
        
    const token = jwt.sign({email},"secret");
    res.cookie("token",token);
        res.redirect("/admin")
       })
    })
})
app.get("/login",async (req,res)=>{
    res.render("login")
})
app.post("/login",async (req,res)=>{
   let user= await userModel.findOne({email:req.body.email});
 
    if(!user){
        return res.status(400).send("user not found")
    }
    await bcrypt.compare(req.body.password,user.password,(err, result)=>{
        if(result) res.send("User Logged in")
            else res.send("User not logged in")
    })

    
})

app.get("/logout",(req,res)=>{
    res.clearCookie("token");
    res.redirect("/")
})
app.get("/admin",async(req,res)=>{
  const users =  await userModel.find();
    res.render("admin",{users})
})

app.listen(4000,()=>{
    console.log("server is running on port 4000")
});
