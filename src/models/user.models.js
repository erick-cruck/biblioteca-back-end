
const mongooes = require("mongoose");
var Schema = mongooes.Schema;

var ModeloUsuario = Schema({
    img: String,
    carnet: Number,
    name: String,
    surname: String,
    usuario: String,
    email: String,
    contrasena: String,
    rol: String,
    librosprestados: Number,
    cantidaddedocuentosprestados: Number
})

module.exports = mongooes.model("Usuarios", ModeloUsuario)