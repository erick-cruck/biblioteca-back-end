'use strict'

var Usuario = require("../models/user.models")
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt.service');

function CrearUnAdministrador(req, res){
    var UsuarioModelo = new Usuario();

    Usuario.findOne({carnet: 1,usuario : "adminpractica"}, (err, UsuarioEncontrado) => {
        if(err) console.log("Error en la petición de busqueda de usuario")

        if(UsuarioEncontrado){
            console.log(UsuarioEncontrado)
        }else{
            bcrypt.hash("adminpractica", null, null, (err, passwordHash) => {

                if(err) console.log("Error en la petición de encriptación")

                if(passwordHash){
                    UsuarioModelo.carnet = 1;
                    UsuarioModelo.usuario = "adminpractica";
                    UsuarioModelo.name = "adminpractica";
                    UsuarioModelo.email = "adminpractica";
                    UsuarioModelo.contrasena = passwordHash;
                    UsuarioModelo.rol = "ADMIN";
                    UsuarioModelo.librosprestados = 0;
                    UsuarioModelo.cantidaddedocuentosprestados = 0;

                    UsuarioModelo.save((err, userSaved) => {
                        if(err) console.log("Error en la petición de guardado")
                        if(!userSaved) console.log("No se a podido guardar el usuario admin")
                        console.log(userSaved)
                    })
                }else{
                    console.log("No se pudo encriptar la contraseña")
                }
            })
        }
    })
}

function CrearUnUsuarioComoAdmin(req, res){
    var UsuarioModelo = new Usuario();
    var userId = req.params.idU
    var params = req.body;

    Usuario.findOne({ _id: userId, rol: "ADMIN"}, (err, usuariosEncontrado) =>{
        if (err) return res.status(500).send({mensaje: "Error en la peticion"});
        if(!usuariosEncontrado) return res.status(404).send({mensaje: "No tienes permiso para realizar esta petición"});


    if(params.carnet && params.usuario && params.name && params.surname && params.email && params.contrasena){


        Usuario.findOne({carnet: params.carnet,usuario : params.Usuario}, (err, UsuarioEncontrado) => {
            if(err) res.status(500).send({mensaje:"Error en la petición de busqueda de usuario"})

            if(UsuarioEncontrado){
                res.status(404).send({mensaje: "Ya existe este usuario"})
            }else{
                bcrypt.hash(params.contrasena, null, null, (err, passwordHash) => {

                    if(err) return res.status(500).send({mensaje: "Error en la petición de encriptación"})
    
                    if(passwordHash){
                        UsuarioModelo.carnet = params.carnet;
                        UsuarioModelo.usuario = params.usuario;
                        UsuarioModelo.name = params.name;
                        UsuarioModelo.surname = params.surname;
                        UsuarioModelo.email = params.email;
                        UsuarioModelo.contrasena = passwordHash;
                        UsuarioModelo.librosprestados = 0;
                        UsuarioModelo.cantidaddedocuentosprestados = 0;
                        if(params.rol){
                            UsuarioModelo.rol = params.rol;
                        }else{
                            UsuarioModelo.rol = "estudiante";
                        }
    
                        UsuarioModelo.save((err, userSaved) => {
                            if(err) res.status(500).send({mensaje:"Error en la petición de guardado"})
                            if(!userSaved) res.status(404).send({mensaje: "No se a podido guardar el usuario admin"})
                            res.status(200).send(userSaved)
                        })
                    }else{
                        res.status(404).send({mensaje:"No se pudo encriptar la contraseña"})
                    }
                })
            }
        })

    }else{
        return res.status(404).send({mensaje: "Rellene los datos necesarios para crear su perfil"})
    }
    })  
}

function ListarTodosLosUsuariosDescendente(req, res){
    var userId = req.params.idU

    Usuario.findOne({ _id: userId, rol: "ADMIN"}, (err, usuariosEncontrado) =>{
        if (err) return res.status(500).send({mensaje: "Error en la peticion"});
        if(!usuariosEncontrado) return res.status(404).send({mensaje: "No tienes permiso para realizar esta petición"});

        Usuario.find((err, UsuariosEncontrados) => {
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
            if(!UsuariosEncontrados) return res.status(500).send({mensaje: 'Error al obtener los usuarios'})
            if(UsuariosEncontrados <= 0){
                return res.status(404).send({mensaje: 'No hay ningun usuario'})
            }else{
                return res.status(200).send(UsuariosEncontrados)
            }
        }).sort({carnet:-1});
    })
    
}

function ListarTodosLosUsuariosAscendente(req, res){
    var userId = req.params.idU

    Usuario.findOne({ _id: userId, rol: "ADMIN"}, (err, usuariosEncontrado) =>{
        if (err) return res.status(500).send({mensaje: "Error en la peticion"});
        if(!usuariosEncontrado) return res.status(404).send({mensaje: "No tienes permiso para realizar esta petición"});

        Usuario.find((err, UsuariosEncontrados) => {
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
            if(!UsuariosEncontrados) return res.status(500).send({mensaje: 'Error al obtener los usuarios'})
            if(UsuariosEncontrados <= 0){
                return res.status(404).send({mensaje: 'No hay ningun usuario'})
            }else{
                return res.status(200).send(UsuariosEncontrados)
            }
        }).sort({carnet:1});
    })
    
}

function BuscarUnUsuarioId(req, res){
    var userId = req.params.idU

    Usuario.findOne({ _id: userId}, (err, usuariosEncontrado) =>{
        if (err) return res.status(500).send({mensaje: "Error en la peticion"});
        if(!usuariosEncontrado) return res.status(404).send({mensaje: "No hay ningun usuario con este código de registro"});
        res.status(200).send(usuariosEncontrado)
    })    
}

function BuscarUnUsuarioPorCarnet(req, res){
    var userId = req.params.idU
    var params = req.body;

    Usuario.findOne({ _id: userId, rol: "ADMIN"}, (err, usuariosEncontrado) =>{
        if (err) return res.status(500).send({mensaje: "Error en la peticion de busqueda 1"});
        if(!usuariosEncontrado) return res.status(404).send({mensaje: "No tienes permiso para realizar esta petición"});

        Usuario.findOne({ carnet: params.carnet}, (err, usuariosEncontrado) =>{
            if (err) return res.status(500).send({mensaje: "Error en la peticion de busqueda"});
            if(!usuariosEncontrado) return res.status(404).send({mensaje: "No hay ningun usuario con este código de registro"});
            res.status(200).send(usuariosEncontrado)
        }) 
    })       
}

function login(req, res){
    var params = req.body;

    if(params.email && params.contrasena){
        Usuario.findOne({ email: params.email}, (err, usuariosEncontrado) =>{
            if (err) return res.status(500).send({mensaje: "Error en la peticion"});

            if(usuariosEncontrado){
                bcrypt.compare(params.contrasena, usuariosEncontrado.contrasena, (err, passCorrecta)=>{
                    if(passCorrecta){
                        return res.status(200).send({
                            token: jwt.createToken(usuariosEncontrado),
                            usuariosEncontrado
                        });
                    }else{
                        return res.status(404).send({mensaje: "Su contraseña es incorrecta"})
                    }
                })
            }else{
                return res.status(404).send({mensaje: "Este correo no existe"})
            }
        })
    }else{
        return res.status(404).send({mensaje: "Ingrese su correo y contraseña"})
    }
}

function EditarUsuarioComoAdmin(req, res){
    var params = req.body;
    var userId = req.params.idU
    var idUsuario = req.params.idUsuario
    delete params.contrasena;

    Usuario.findOne({ _id: userId, rol: "ADMIN"}, (err, usuariosEncontrado) =>{
        if (err) return res.status(404).send({mensaje: "Error en la petición de busqueda"});
        if(!usuariosEncontrado) return res.status(404).send({mensaje: "No tienes permiso para realizar esta petición"});

        Usuario.findByIdAndUpdate(idUsuario, params, { new: true }, (err, usuarioActualizado)=>{
            if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if(!usuarioActualizado) return res.status(404).send({ mensaje: 'No se ha podido actualizar al Usuario' });
            return res.status(200).send(usuarioActualizado);
        })
    })
}

function EliminarUsuariosComoAdmin(req, res){
    var params = req.body;
    var userId = req.params.idU
    var EUser = req.params.idEu

    Usuario.findOne({ _id: userId, rol: "ADMIN"}, (err, usuariosEncontrado) =>{
        if (err) return res.status(404).send({mensaje: "Error en la petición de busqueda"});
        if(!usuariosEncontrado) return res.status(404).send({mensaje: "No tienes permiso para realizar esta petición"});

        Usuario.findByIdAndDelete(EUser, (err, eliminarusuario) => {
            if(err) return res.status(500).send({mensaje: 'Error en la petición de eliminar'})
            if(!eliminarusuario) return res.status(404).send({mensaje: 'No se ha podido eliminar el usuario'})
            return res.status(200).send({mensaje: 'Su usuario fue eliminado'})
        })
    })
}   

function ObtenerLosUsuairosConMasPrestaciones(req, res){
    Usuario.find((err, UsuarioEncontrado) => {
        if (err) return res.status(404).send({mensaje: "Error en la petición de busqueda"});
        if(!UsuarioEncontrado) return res.status(404).send({mensaje: "Error en la petición de busqueda"});
        return res.status(200).send(UsuarioEncontrado)
    }).sort({cantidaddedocuentosprestados:-1}).limit(10);
}

module.exports = {
    login,
    CrearUnAdministrador,
    CrearUnUsuarioComoAdmin,
    ListarTodosLosUsuariosAscendente,
    ListarTodosLosUsuariosDescendente,
    BuscarUnUsuarioId,
    BuscarUnUsuarioPorCarnet,
    EditarUsuarioComoAdmin,
    EliminarUsuariosComoAdmin,
    ObtenerLosUsuairosConMasPrestaciones
}