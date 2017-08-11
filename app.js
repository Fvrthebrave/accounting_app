var express         = require("express"),
    mongoose        = require("mongoose"),
    bodyParser      = require("body-parser"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    sanitizer       = require("express-sanitizer"),
    methodOverride  = require("method-override"),
    Client          = require("./models/client.js"),
    User            = require("./models/user.js");

    
    
    
var app = express();

// Set through export DATABASEURL=mongodb://localhost/db_name
mongoose.connect(process.env.DATABASEURL);

var clientRoutes = require("./routes/clients"),
    planRoutes   = require("./routes/plans"),
    authRoutes   = require("./routes/index");

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//******************************************************************************
// PASSPORT CONFIG
//******************************************************************************
app.use(require("express-session")({
    secret: "Chewy is the best dog ever",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//******************************************************************************

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(authRoutes);
app.use(clientRoutes);
app.use(planRoutes);


//SeedDB();

//DEFAULT ROUTE

app.get("*", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Server is listening...');
});

// function SeedDB(){
//     Client.remove({}, function(err){
//         if(err){
//             console.log(err);
//         } else {
//             console.log('Clients removed!');
//         }
//     });
// }
