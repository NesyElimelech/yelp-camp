var express 		= require("express"),
	router 			= express.Router({mergeParams: true}),
	Campground 		= require("../models/campground"),
	Comment 		= require("../models/comment"),
	middleware  	= require("../middleware");


//Comment new - renders a form to add comment
router.get("/new", middleware.isLoggedIn, (req,res)=> {
	Campground.findById(req.params.id,(err, campground)=> {
		if(err){
			console.log(err);
			req.flash("error","Something went wrong");
			res.redirect("back");
		} else {
			res.render("comments/new",{campground: campground});
		}
	});
});

// Comments Create
router.post("/", middleware.isLoggedIn, (req, res)=>{
	Campground.findById(req.params.id,(err, campground)=> {
		if(err){
			console.log(err);
			req.flash("error","Campground wasn't found");
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, (err, comment)=>{
				if(err){
					console.log(err);
					req.flash("error","Something went wrong");
					res.redirect('/campgrounds/'+campground._id);
				} else {
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Comment was successfuly added");
					res.redirect('/campgrounds/'+campground._id);
				}
			});
		}
	});
});

// Edit comment Route
router.get("/:comment_id/edit", middleware.isCommentOwner, (req,res)=>{
	Comment.findById(req.params.comment_id, (err,foundComment)=>{
		if(err){
			req.flash("error","Comment wasn't found!");
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment:foundComment});
		}
	});
});

//Updated Comment Route
router.put("/:comment_id", middleware.isCommentOwner, (req,res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err,updatedComment)=>{
		if(err){
			req.flash("error","Something went wrong");
			res.redirect("back");
		} else{
			req.flash("success", "Comment was successfuly updated");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//Delete route
router.delete("/:comment_id", middleware.isCommentOwner, (req, res)=>{
	Comment.findByIdAndDelete(req.params.comment_id, (err)=>{
		if(err){
			req.flash("error","Something went wrong");
			res.redirect("back");
		} else {
			req.flash("success", "Comment was successfuly deleted");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});



module.exports = router;