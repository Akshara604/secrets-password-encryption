
 require('dotenv').config()
 const express = require("express");
 const bodyParser = require("body-parser");
 const ejs = require("ejs");
 const mongoose = require("mongoose");
 const encrypt = require("mongoose-encryption");

 const app = express();

 app.use(express.static("public"));
 app.set('view engine','ejs');
 app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//for encryption

userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ['password']});

//To create a new collection.
const User = new mongoose.model("User",userSchema);

 app.get("/",function(req,res){
     res.render("home");
 });

 app.get("/login",function(req,res){
    res.render("login");
});

 app.get("/register",function(req,res){
    res.render("register");
});

//To register users
app.post("/register",function(req,res){
     const newUser = new User({
         email: req.body.username, //here username is the name field in the form
         password: req.body.password
     });

     newUser.save(function(err){
         if(err){
             console.log("Error");
         } else{
             res.render("secrets"); //It's imp to note that we render secrets page only after register 
         }
     });
});

app.post("/login",function(req,res){
      const username = req.body.username;
      const password = req.body.password;

      User.findOne({email:username}, function(err,foundUser){
          if(err){
              console.log("error");
          } else{
              if(foundUser){
                  if(foundUser.password === password){
                      res.render("secrets");
                  }
              }
          }
      });
});

app.listen(3000,function(){
    console.log("Listening at port 3000");
});