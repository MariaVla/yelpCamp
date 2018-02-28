var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");




// INDEX - Show all campgrounds
router.get("/", function(req, res){
    //Get campgrounds from the database 
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
        } else {
            res.render("index.ejs", {campgrounds: allCampgrounds});

        }
    });
});

//CREATE - Crear nuevos campamentos
router.post("/", middleware.isLoggedIn, function(req,res){
    var title = req.body.title;
    var imagen = req.body.imagen;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCamp = {title: title, imagen: imagen, description: desc, author: author};
    // Crear un nuevo campground y guardar a la DB
    Campground.create(newCamp, function(err, nuevoCamp){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
    
});

// NEW - form para crear un nuevo campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("new.ejs");
});

// SHOW - mostrar info de un campamento
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
        if (err) {
            console.log(err);
        } else { 
            res.render("show.ejs", {campground: foundCamp});
        }
    });
    
});

//EDIT      campground route "/campgrounds/:id/edit"
router.get("/:id/edit", middleware.checkCampOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCamp){
        if (err) {
            req.flash("err", "Campground not found");
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit.ejs", {campground: foundCamp});
        }
    });

});
//UPDATE    campground route "/campgrounds/:id"
router.put("/:id", middleware.checkCampOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id); 
        }
    });
});

//DESTROY   campground route "/campgrounds/:id"
router.delete("/:id", middleware.checkCampOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;