// Declare MySQL as a variable
const mysql = require("mysql");
// Declare the Express App
const express = require("express");
// Declare the Body Parser
const bodyParser = require("body-parser");
// Declared the encoder with extended parameters, otherwise deprecation warning
const encoder = bodyParser.urlencoded({ extended: true });
// Declare the Body Parser Json function
const bodyjson = bodyParser.json();
// Initialize the Express app
const app = express();
// Declare the Cookies requirements
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')

// Reference our Settings
const settings = require("./settings.json"); 
// Reference our Utils file
const utils = require('./Utils');

// Set the port based on the settings in settings.json
var port = settings.express.port;

// Create a connection to MySQL based on the settings in settings.json
var connection = mysql.createConnection({ 
    host     : settings.mysql.host, 
    user     : settings.mysql.user, 
    password : settings.mysql.password, 
    database : settings.mysql.database 
});

// Connect to the database
connection.connect(function(error){ if (error) throw error; else console.log("Connected to the database successfully!"); });

// Use the Body Parser Functions
app.use(encoder);
app.use(bodyjson);
// Use the Cookies Functions
app.use(cookieParser());
app.use(cookieSession({
    name: settings.express.cookie_session_name,
    secret: settings.express.cookie_secret,
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }));
// Use all assets in the assets folder, such as stylesheets
app.use("/assets",express.static("assets"));

//////////////////////// Start POST Pages ////////////////////////
//
// When the user attempts to login
app.post("/login",encoder, function(req,res){
    // Set the username and password to the posted data from the client
    var username = req.body.username, password = req.body.password;    
    // Create a hash with our custom function in the Utils
    var hash = utils.pbkdf2(username, password, settings.cryptography.salt, settings.cryptography.iterations, settings.cryptography.length);
    // Select the account and check if the name and hash matches
    connection.query("select * from accounts where name = ? and password = ?",[username, hash],function(error,results,fields){
        // If it matches, redirect them to the home page
        if (results.length > 0) res.redirect("/home");
        // Else if it doesn't, then redirect to login page
        // Todo: show incorrect
        else res.redirect("/login");
        // End
        res.end();
    });
});
//////////////////////// End POST Pages ////////////////////////

//////////////////////// Start GET Pages ////////////////////////
// When user goes to login page
app.get("/login",function(req,res){
    // Send Data from File
    res.sendFile(__dirname + "/pages/login/index.html");
    // Remove ? if exists as last character
    RedirectToCleanUrl(req, res);
});
// When login is successful
app.get("/home",function(req,res){
    // Send Data from File
    res.sendFile(__dirname + "/pages/home/index.html")
    // Remove ? if exists as last character
    RedirectToCleanUrl(req, res);
});
// When user goes to register page
app.get("/register",function(req,res){
    // Send Data from File
    res.sendFile(__dirname + "/pages/register/index.html")
    // Remove ? if exists as last character
    RedirectToCleanUrl(req, res);
});
//////////////////////// End GET Pages ////////////////////////

//////////////////////// Start Helper Functions ////////////////////////
function RedirectToCleanUrl(req, res){ if (utils.HasChar(req.originalUrl, "?")) res.redirect(utils.SplitShiftChar(req.originalUrl, "?")); }
//////////////////////// End Helper Functions ////////////////////////

// Tell the Express App to listen on the Port
app.listen(port);