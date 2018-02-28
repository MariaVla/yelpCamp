var mongoose        = require("mongoose");
var Campground      = require("./models/campground");
var Comment         = require("./models/comment");
 
 var data = [
    {
        title: "Camp1",
        imagen: "http://www.everestian.com/img/afs2.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo"
    },
    {
        title: "Camp2",
        imagen: "http://www.everestian.com/photos/371234.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo" 
    },
    {
        title: "Camp3",
        imagen: "http://www.everestian.com/photos/786120.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo" 
    }
]

 function seedDB(){
     //remove all campgrounds
     Campground.remove({}, function(err) {
         if (err) {
             console.log(err);
         }
         console.log("removed campgrounds");
         //add a few campgrounds
         data.forEach(function(seed){
             Campground.create(seed, function(err, campground){
                 if (err) {
                     console.log(err);
                 } else {
                     console.log("Added Campground");
                     //create a comment
                     Comment.create({
                         text: "Este es el comentario",
                         author: "Majo"
                     }, function(err, comment){
                         if (err) {
                             console.log(err);
                         } else {
                            //si podemos create un comentario,
                            //lo asociamos a un campground
                            //para asociarlo, lo agregamos a la
                            //coleccion de comentarios que tiene
                            //cada campamento
                            campground.comments.push(comment);
                            campground.save();
                            console.log("add comment");
                         }
                     });
                 }
             });
         });
         
     });
     
     
     //add a few coments
 }
 
 module.exports = seedDB;