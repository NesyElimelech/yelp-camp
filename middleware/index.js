var Campground 		= require("../models/campground"),
	User        	= require("../models/user"),
	Comment 		= require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn =  function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged-in to do that!");
    res.redirect("/login");
};

middlewareObj.isCampgroundOwner = function (req, res ,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, (err, foundCampground) => {
			if (err){
				req.flash("error", "Campground wasn't found!");
				res.redirect("back");
			}else 
				{
					if(foundCampground.author.id.equals(req.user._id)){
						return next();
					} else {
						req.flash("error", "You are not allowed to do that!");
						res.redirect("back");
					}
				}
			});
		} else {
			req.flash("error", "You need to be logged-in to do that!");
			res.redirect("/login");
	}
};

 middlewareObj.isCommentOwner = function(req, res ,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, foundComment)=>{
			if (err){
				req.flash("error","Comment wasn't found");
				res.redirect("back");
			}else 
				{
					if(foundComment.author.id.equals(req.user._id)){
						return next();
					}else {
						req.flash("error","You are not allowed to do that!");
						res.redirect("back");
					}
				}
			});
		} else {
			req.flash("error", "You need to be logged-in to do that!");
			res.redirect("/login");
	}
};

module.exports = middlewareObj;