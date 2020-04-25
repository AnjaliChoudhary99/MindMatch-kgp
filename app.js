    //jshint esversion:6

    const express = require('express');
    const ejs = require('ejs');
    const bodyParser = require('body-parser');
    const mongoose = require('mongoose');
    const session = require('express-session');
    const passport = require("passport");
    const passportLocalMongoose = require('passport-local-mongoose');

    //setup server
    const app = express();

    app.set("view engine" , "ejs");
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(express.static("public"));   // to correctly send the images and css files

    app.use(session({
        secret: "ourLittleSecretKey.",
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    // making a local database named mindmatchDB
    mongoose.connect( "mongodb://localhost:27017/MindMatchDB", { useNewUrlParser: true, useUnifiedTopology: true } );
    // mongoose.set("useCreateIndex", true);

    // making a schema for the user info
    const userSchema =  mongoose.Schema({
        username : String,
        // email : String,
        password : String
    });
    userSchema.plugin(passportLocalMongoose);

    // making a model of this userSchema which will represent a collection in MindMatchDB database
    const User = new mongoose.model("User", userSchema); // this will be cleverly converted to plural

    passport.use(User.createStrategy());
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());


    //get request to server
    app.get("/", function(req,res){
        //sending information from server side
        res.render("index", {});
    });


    app.get("/login", function(req,res){
        res.render('login', {});
    });
    app.get("/register", function(req,res){
        res.render('register',{});
    });
    app.get("/adminlogin", function(req,res){
        res.render('admin-login',{});
    });


    app.get("/about", function(req,res){
        res.render('about',{});
    });
    app.get("/contact", function(req,res){
        res.render('contact',{});
    });

    app.post("/login",function(req,res){

    });
    app.get("/UserHome",function(req,res){
        if(req.isAuthenticated()){
            res.render('UserHome',{});
        } else{
            res.redirect('/login');
        }
    });
    app.post("/register",function(req,res){
        // console.log(req.body);
        User.register( {username:req.body.username} , req.body.password , function(err,user){
            if(err){
                console.log(err);
                res.redirect("/register");
            } else{
                passport.authenticate("local")(req,res,function(){
                    res.redirect("/UserHome");
                });
            }
        });
    });
    app.post("/adminlogin",function(req,res){

    });


    //start listning (just to turn on the server)
    app.listen(process.env.PORT || 3000, function(){
        console.log("server started on port 3000");
    });
