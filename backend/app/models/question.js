// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var questionSchema = mongoose.Schema({

    questionText: String,
    answers : []
});

// create the model for questions and expose it to our app
module.exports = mongoose.model('Question', questionSchema);
