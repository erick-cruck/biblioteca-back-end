'use strict'
const mongooes = require("mongoose");
var Schema = mongooes.Schema;

var ModeloPrestamos = Schema({
    iduser: String,
    idlibro: String,
    img: String,
    autor: String,
    name: String,
    edicion: String,
    tipo: String,
    estado: String,
    fechadesolicitud: String,
    fechadeentrega: String
})

module.exports = mongooes.model("Prestamos", ModeloPrestamos)