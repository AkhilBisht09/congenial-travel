var express = require("express");
var router = express.Router();
var passport = require("passport");

//show sign up form
router.get("/register",function(req,res){
    res.render("register");
});
//user sign up
router.post("/register", function(req,res){
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");

        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secret");
        });
    });
});

///Login forms

router.get("/login",function(req,res){
    res.render("login");
});


//login login

//middleware
router.post("/login", passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect: "/auth/login"
}),
    function(req,res){
});

router.get("/logout",function(req,res){
    req.logout();    ///destroying user session
    res.redirect("/");
});

module.exports = router;