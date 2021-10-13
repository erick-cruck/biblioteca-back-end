"use strict"

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "IN6BM"

exports.createToken = function (Usuario){
    var playload = {
        img: String,
        carnet: Number,
        name: String,
        surname: String,
        rol: String,
        iat: moment().unix(),
        exp: moment().day(24, "hour").unix()
    }

    return jwt.encode(playload, secret);
}