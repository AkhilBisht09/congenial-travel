var express               =require("express"),
    mongoose              =require("mongoose"),
    passport              =require("passport"),
    User                  =require("./models/user"),
    LocalStrategy         =require("passport-local"),
    bodyParser            =require("body-parser"),
    app                   =express(),
    passportLocalMongoose =require("passport-local-mongoose");

const http = require('http');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const authRoutes = require("./routes/auth");
const mapRoutes = require("./routes/map");
var users = new Users();

mongoose.connect("mongodb+srv://Vedaant:vedaant123@cluster0-yunv0.mongodb.net/test?retryWrites=true", {useNewUrlParser: true});
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

var server = http.createServer(app);
var io = socketIO(server);

app.get("/secret",isLoggedIn ,function(req,res){
    res.render("dashboard");
});

app.get("/",function(req,res){
    res.render("home");
});

app.get("/chat", function(req, res) {
    res.render("chat");
});

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }

    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));  
    }
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/auth/login");
}

var port = process.env.PORT || 3000;
server.listen(port,function(){
    console.log("Serving on port", port);
});
