var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

//SETUP SCHEMA
var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

//le da metodos y funcionalidades al user
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);