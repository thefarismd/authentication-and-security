//jshint esversion:6

//---- Modules ----//
require('dotenv').config() //Always at the top

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const md5 = require("md5");

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); //

//---- MongoDB-Moongoose Connection DB, Schema, Model ----//
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model('User', userSchema); //

//---- Get Route ----//
app.get("/", function(req, res){
    res.render('home');
});

app.get("/login", function(req, res){
    res.render('login');
});

app.get("/register", function(req, res){
    res.render('register');
});

//---- Post Route ----//
app.post("/register", function (req, res) {

    const newUser = new User ({
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save(function(err){
        if(!err) {
            res.render("secrets");
        } else {
            console.log(err);
        };
    });
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            if (foundUser.password === password) {
                res.render("secrets");
            }
        };
    });
});

//---- Server Connection ----//
app.listen(3000, function () {
    console.log("Server started on port 3000");
}); //