'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = Schema({

    name: String,
    surname: String,
    dpi: String,
    user: String,
    email: String,
    password: String,
    estado: String,
    img: String,
    rol: String

})

module.exports = mongoose.model('User', userSchema) 