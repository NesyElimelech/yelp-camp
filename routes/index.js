var express     = require("express"),
    passport    = require("passport"),
    User        = require("../models/user"),
    Campground  = require("../models/campground"),
    router      = express.Router({mergeParams: true});

// Home page
router.get("/", (req, res) =>{
  res.render("home");
});

//show register form
router.get("/register", (req, res)=>{
	res.render("register");
});

//hendle signup logic
router.post("/register", (req,res)=>{
	var newUser = new User({username: req.body.username})
	User.register(newUser, req.body.password, (err, user)=>{
      if(err){
          console.log(err);
          return res.render("register", {error: err.message});
      }

			passport.authenticate("local")(req, res, ()=>{
            req.flash("success", "Welcome to YelpCamp "+user.username);
           	res.redirect("/campgrounds"); 
        });
    });
});

// login route
router.get("/login", (req, res)=>{
   res.render("login"); 
});

// handling login route
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res)=>{
});

// logout route
router.get("/logout", (req, res)=>{
   req.logout();
   req.flash("success", "You Successfuly loged out!");
   res.redirect("/campgrounds");
});

module.exports = router;