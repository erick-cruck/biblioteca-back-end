'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = Schema({

    name: String,
    carnet: String,
    user: String,
    surname: String,
    email: String,
    password: String,
    img: String,
    rol: String

})

module.exports = mongoose.model('User', userSchema) 