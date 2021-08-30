'use strict'

var mongoose = require('mongoose')
var app = require('./app')
var User = require('./src/models/user')
var bcrypt = require('bcrypt-nodejs')
 
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/BibliotecaVirtualDB', {useNewUrlParser: true, useFindAndModify: true})
    .then(()=>{
        console.log('Estas conectado a la base de datos')

        var name = 'ADMIN'
        var user1 = 'adminpractica'
        var email = 'adminpractica'
        var img = 'https://e7.pngegg.com/pngimages/504/457/png-clipart-computer-icons-icon-public-library-books-miscellaneous-presentation.png'
        var password = 'adminpractica'
        var rol = 'ROL_ADMIN'

        var userModel = new User()

        userModel.name = name
        userModel.user = user1
        userModel.email = email
        userModel.img = img
        userModel.rol = rol

        User.find({email: userModel.email}).exec((err, userStored)=>{
            if(userStored && userStored.length == 1){
                return console.log('El Admin ya fue creado')
            }else{
                bcrypt.hash(password, null, null, (err, bcryptPassword)=>{
                    userModel.password = bcryptPassword

                    userModel.save((err, userSave)=>{
                        if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
                        if(userSave){
                            return console.log(userSave)
                        }else{
                            return res.status(400).send({mensaje: 'Admin no registrado'})
                        }
                    })
                })
            }
        }) 

        app.listen(3000, ()=>{
            console.log('El Servidor esta corriendo en el puerto 3000')
        })
    })
    .catch(err=>console.log(err)) 