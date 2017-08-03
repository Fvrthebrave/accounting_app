var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");

router.get("/", function(req, res){
    res.render("home");
});
//**************************************
// AUTH ROUTES
//**************************************

//show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message + "!");
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Successfully created account for " + user.username);
            res.redirect("/");
        });
    });
});

//**************************************
// LOGIN ROUTES
//**************************************

//show login form
router.get("/login", function(req, res){
   res.render("login");
});

//handle login logic with middleware
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }), 
        function(req, res){
            console.log(currentUser);
    if(req.currentUser){
        
    }
});

// LOGOUT ROUTE
router.get("/logout", function(req, res){
   console.log(req.user.username);
   req.logout();
   req.flash("success", "Successfully logged out!");
   res.redirect("/");
});

module.exports = router;