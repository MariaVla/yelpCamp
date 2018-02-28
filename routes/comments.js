var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//comments NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find campground by id 
    Campground.findById(req.params.id, function(err, foundCamp){
        if (err) {
            console.log(err);
        } else {
            res.render("newComment.ejs", {campground: foundCamp});
        }
    })
    
});

//comments CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    //encontrar el campground con el id
    Campground.findById(req.params.id, function(err, foundCamp){ 
        if (err) {
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundCamp.comments.push(comment);
                    foundCamp.save();
                    req.flash("success", "Comment made!");
                    res.redirect("/campgrounds/" + foundCamp._id);
                }
            });
        }
    })
    
});

//EDIT      comment routes 
//campgrounds/:id/comments/:id/edit por como esta definida toda la ruta
//tengo que ponerle comments_id, porque no puede haber dos parametros :id
//tmb con req.params.id accedo al id del campground
router.get("/:comments_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comments_id, function(err, foundComment){
        if (err) {
            res.redirect("back");
        } else {
             res.render("comments/edit.ejs", {campground_id: req.params.id, comment: foundComment});
        }
    });
   
});
//UPDATE    comment routes  campgrounds/:id/comments/:id
router.put("/:comments_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comments_id, req.body.comment, function(err, update){
       if (err) {
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});


//DESTROY   comment routes
router.delete("/:comments_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comments_id, function(err){
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


//middleware
// function isLoggedIn(req, res, next){
//     if (req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

// function checkCommentOwnership(req, res, next){
//     //si estoy logeado
//         //si logeado = owner campground
//             //edit o delete
//         //else 
//             //redireigir a donde estaba
//     //else 
//         //redirigir a donde estaba
//     if (req.isAuthenticated()){
//         //si estoy loggeado chequeo que coincida
//         //con el autor del campamneto
//         Comment.findById(req.params.comments_id, function(err, foundComment) {
//             if (err) {
//                 res.redirect("back");
//             } else {
//                 if (foundComment.author.id.equals(req.user._id)) {
//                     next();
//                 } else {
//                     res.redirect("back");
//                 }
//             }
//         });
//     } else {
//         res.redirect("back");
//     }
// }
module.exports = router;