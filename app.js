var express               =require("express"),
    mongoose              =require("mongoose"),
    passport              =require("passport"),
    User                  =require("./models/user"),
    LocalStrategy         =require("passport-local"),
    bodyParser            =require("body-parser"),
    app                   =express(),
    passportLocalMongoose =require("passport-local-mongoose");

const authRoutes = require("./routes/auth");
const mapRoutes = require("./routes/map");

mongoose.connect("mongodb+srv://Vedaant:vedaant123@cluster0-yunv0.mongodb.net/test?retryWrites=true");
app.use(require("express-session")({
    secret:"Rusty is the cutest",
    resave:false,
    saveUninitialized: false,
    
}));
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

///================
///   ROUTES
///================

app.use("/auth", authRoutes);
app.use("/map", mapRoutes);

app.get("/secret",isLoggedIn ,function(req,res){
    res.render("secret");
});

app.get("/",function(req,res){
    res.render("home");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/auth/login");
}
var port = process.env.PORT || 3000;
app.listen(port,function(){
    console.log("Serving on port", port);
});
