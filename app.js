//variables and consts
const ip   	  		        = process.env.IP, // retrive the ip of localhost
	  port       		    = process.env.PORT || 1337, // define the port to be 1337
	  express    		    = require("express"),
 	  request    		    = require("request"),
	  mongoose   		    = require('mongoose'),
	  passport		        = require("passport"),
	  bodyParser 		    = require("body-parser"),
	  flash 				= require("connect-flash"),
	  cookieParser 			= require("cookie-parser"),
	  LocalStrategy 	    = require("passport-local"),
	  methodOverride		= require("method-override"),
	  passportLocalMongoose = require("passport-local-mongoose"); 

var app = express(),
	Campground 			= require("./models/campground"),
	Comment 			= require("./models/comment"),
	User 			  	= require("./models/user"),
	campgroundsRoutes 	= require("./routes/campgrounds"),
	commentsRoutes 		= require("./routes/comments"),
	indexRoutes 		= require("./routes/index");

//	seedDB		= require("./models/seeds");

//connecting the app to the DB 
mongoose.connect("mongodb+srv://Nesy:EEwn1nPphzPflLvY@cluster0-nfdeh.mongodb.net/YelpCamp-Online?retryWrites=true&w=majority",  
{ useNewUrlParser: true , useCreateIndex: true}).then(()=>{console.log('Connected to db')}).catch(err => {
	console.log('Error in Connecting to db: ', err.message)
});


//seedDB(); //->to init DB and add data to it


//app and passport config
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(cookieParser('secret'));
app.locals.moment 	= require('moment');

//Passport config
app.use(require("express-session")({
	secret: "somthing we need to right here so i'm guessing what",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=>{ 
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);
app.use(indexRoutes);

///==========================
//	Server Setup
//===========================

// starts the server listening at localhost:1337/
app.listen(port, ip,() =>{
	console.log("Server is up!");
}); 