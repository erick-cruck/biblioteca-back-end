"use strict"

const mongoose = require("mongoose");
const app = require("./app");
const UsuarioControlador = require("./src/controllers/user.controllers")

mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://admin:admin@cluster0.btgbt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("Se encuentra conectado a la Base de Datos");
    

    app.listen(process.env.PORT || 3000, function () {
        console.log("El Servidor esta arracando en el puerto 3000");
        UsuarioControlador.CrearUnAdministrador();
    })

}).catch(err => console.log(err));