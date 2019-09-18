var express 	= require("express"),
	router 		= express.Router({mergeParams: true}),
	Campground 	= require("../models/campground"),
	Comment 	= require("../models/comment"),
	middleware 	= require("../middleware");

// The all Campgorunds view page route
router.get("/", (req, res) =>{

	//desplay all the index in the DB 
	Campground.find({}, (err, allCampground) =>{
		if(err){
			console.log(err);
			req.flash("error","Campgrounds wasn't found");
			res.redirect("/");
		} 
		else {
			res.render("campgrounds/index",{campgrounds: allCampground});
		}
	})
});

// Form page to add the new campground details route
router.get("/new", middleware.isLoggedIn, (req, res) =>{
	res.render("campgrounds/new");
});

//Creating new Campground route
router.post("/", middleware.isLoggedIn, (req, res)=>{
	// retrive the info from the form page
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var description = req.body.description;
	var author =  {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {
		name: name,
		image: image,
		price: price,
		description: description,
		author: author
	};
	
	Campground.create(newCampground ,(err , newCampground) => {
		if(err){
			console.log(err);
			req.flash("error","Something went wrong");
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Campground was successfuly added");
			res.redirect("/campgrounds");
		}
	});
});

// SHOW info about a specific Campground route
router.get("/:id", middleware.isLoggedIn, (req, res)=>{
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground)=>{
		if (err){
			console.log(err);
			req.flash("error","Something went wrong");
			res.redirect("/campgrounds");
		} else {
			res.render("campgrounds/show", {campground: foundCampground });
		}
	});
});

//Edit route
router.get("/:id/edit", middleware.isCampgroundOwner, (req,res)=>{
	Campground.findById(req.params.id, (err,foundCampground)=>{
		if(err){
			req.flash("error","Campground wasn't found!");
			res.redirect("/campgrounds");
		}else{
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	});
});

//Update route
router.put("/:id/edit", middleware.isCampgroundOwner, (req,res)=>{
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
		if(err){
			req.flash("error","Something went wrong");
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Campground was successfuly updated");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//delete route
router.delete("/:id", middleware.isCampgroundOwner, (req,res)=>{
	Campground.findByIdAndDelete(req.params.id, (err)=>{
		if(err){
			req.flash("error","Something went wrong");
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Campground was successfuly deleted");
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;