'use strict'

var Usuario = require("../models/user.models")
var Libros = require("../models/librera.models")
var Prestamos = require("../models/prestamo.models")

function AgregarUnNuevoLibro(req, res){
   var params = req.body;
   var userId = req.params.idU;
   var ModeloLibros = new Libros();

   /* se verifica que se allan llenado los datos necesarios */
   if(params.palabrasclaves 
    && params.autor 
    && params.name 
    && params.edicion 
    && params.Temas
    && params.tipo){

    /* se busca el usuario para ver si es administrador */
    Usuario.findOne({ _id: userId, rol: "ADMIN"}, (err, usuariosEncontrado) => {
                if(err) return res.status(404).send({mensaje: "Error en la petición de busqueda"})
                if(usuariosEncontrado){
                    /*funcion para buscar el libro para ve si existe */
                    Libros.findOne({autor: params.autor, name: params.name, edicion: params.edicion}, (err, libroencontrado) =>{
                        if(err) return res.status(500).send({mensaje: "Error en la petición de busqueda"})
                        if(libroencontrado){
                            return res.status(200).send({mensaje: "El libro ya existe"})
                        }else{

                            // Se realiza la separación de datos de las palabras claves
                            var texto = params.palabrasclaves
                            var temas = params.Temas
                            var posicion1 = texto.indexOf(",")
                            var arraydatos = []
                            var arraytemas = []

                            if(posicion1 == -1){
                                arraydatos.push(texto)
                            }else{

                            do{
                                var posicion2 = texto.indexOf(",")
                                var imprimirtexto = texto.substr(0, posicion2)
                                arraydatos.push(imprimirtexto)
                                posicion2 = posicion2+2
                                texto = texto.substring(posicion2)
                                var posicion1 = texto.indexOf(",")
                            }while(posicion1 != -1 )
                            arraydatos.push(texto)
                            
                            }

                            // Se realiza la separación de datos de los temas
                            var posicion1 = temas.indexOf(",")

                            if(posicion1 == -1){
                                arraytemas.push(temas)
                            }else{
                                do{
                                    var posicion2 = temas.indexOf(",")
                                    var imprimirtexto = temas.substr(0, posicion2)
                                    arraytemas.push(imprimirtexto)
                                    posicion2 = posicion2+2
                                    temas = temas.substring(posicion2)
                                    var posicion1 = temas.indexOf(",")
                                }while(posicion1 != -1)
                                arraytemas.push(temas)
                            }

                            // se gurda el nuevo libro
                            ModeloLibros.img = params.img;
                            ModeloLibros.autor = params.autor;
                            ModeloLibros.name = params.name;
                            ModeloLibros.edicion = params.edicion;
                            ModeloLibros.descripcion = params.descripcion;
                            ModeloLibros.copias = params.copias;
                            ModeloLibros.Dispobles = params.copias;
                            ModeloLibros.palabrasclaves = arraydatos;
                            ModeloLibros.Temas = arraytemas;
                            ModeloLibros.frecuenciaactual = params.frecuenciaactual;
                            ModeloLibros.ejemplares = params.ejemplares;
                            ModeloLibros.vecesvisto = 0;
                            ModeloLibros.cantidaddedocuentosprestados = 0;
                            
                            if(params.tipo == "Revistas"){
                                ModeloLibros.tipo = params.tipo
                            }else{
                                ModeloLibros.tipo = "Libro"
                            }



                            ModeloLibros.save((err, userSaved) => {
                                if(err) res.status(500).send({mensaje:"Error en la petición de guardado"})
                                if(!userSaved) res.status(404).send({mensaje: "No se a podido guardar su libro"})
                                return res.status(200).send(userSaved)
                            })
                        }       
                    })
                }else{
                    return res.status(404).send({mensaje: "No tiene permisos para agregar un nuevo libro"})
                }
            })  
   }else{
       return res.status(404).send({mensaje: "Rellene los datos necesarios"})
   }
}

function buscarporpalabrasclaves(req, res){
    var params = req.body.palabrasclaves
    
    Libros.find({palabrasclaves: params},(err, BusquedaPorPalabrasClaves) => {
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
        if(!BusquedaPorPalabrasClaves) return res.status(404).send({mensaje: 'Error al obtener los libros'})
        if(BusquedaPorPalabrasClaves <= 0){
            Libros.find({Temas: params},(err, BusquedaPorTemas) => {
                if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
                if(!BusquedaPorTemas) return res.status(404).send({mensaje: 'Error al obtener los libros'})
                if(BusquedaPorTemas <= 0){
                    return res.status(404).send({mensaje: 'No hay libros con estos datos de busqueda'})
                }else{
                    return res.status(200).send(BusquedaPorTemas)
                }
            })
        }else{
            return res.status(200).send(BusquedaPorPalabrasClaves)
        }
    })
}

function ObtenerTodoLosDocumentos(req, res){
    Libros.find({}, (err, UsuariosEncontrados) => {
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
        if(!UsuariosEncontrados) return res.status(500).send({mensaje: 'Error al obtener todos los documentos'})
        if(UsuariosEncontrados.length != 0){
            return res.status(200).send(UsuariosEncontrados)
        }else{
            return res.status(404).send({mensaje: 'No hay ningun documento'})
        }
    }).sort({autor:1});
}  

function ObtenerTodosLosLibros(req, res){

    Libros.find({tipo: "Libro"}, (err, UsuariosEncontrados) => {
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
        if(!UsuariosEncontrados) return res.status(500).send({mensaje: 'Error al obtener los libros'})
        if(UsuariosEncontrados.length == 0){
            return res.status(404).send({mensaje: 'No hay ningun libro'})
        }else{
            return res.status(200).send(UsuariosEncontrados)
        }
    }).sort({autor:1});
}

function ObtenerTodasLasRevistas(req, res){

    Libros.find({tipo: "Revistas"}, (err, UsuariosEncontrados) => {
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
        if(!UsuariosEncontrados) return res.status(500).send({mensaje: 'Error al obtener las revistas'})
        if(UsuariosEncontrados.length == 0){
            return res.status(404).send({mensaje: 'No hay revistas'})
        }else{
            return res.status(200).send(UsuariosEncontrados)
        }
    }).sort({autor:1});
} 

function ObtenerUnSoloLibro(req, res){

    var userId = req.params.idU

    Libros.findOne({ _id: userId}, (err, usuariosEncontrado) =>{
        if (err) return res.status(500).send({mensaje: "Error en la peticion"});
        if(!usuariosEncontrado) return res.status(404).send({mensaje: "No hay libro con este código de registro"});
        var params = usuariosEncontrado.vecesvisto +1
        Libros.findByIdAndUpdate(userId, {vecesvisto: params}, {new: true}, (err, libroeditado) => {
            if(err) return res.status(500).send({mensaje: 'Error en la petición de editar'})
            if(!libroeditado) return res.status(404).send({mensaje: 'No se ha podido actualizar el libro'})
            return res.status(200).send(libroeditado)
        })
    })  
}

function ObtenerDocumentosMasVistos(req, res){
    Libros.find((err, UsuariosEncontrados) => {
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
        if(!UsuariosEncontrados) return res.status(500).send({mensaje: 'Error al obtener los libros'})
        if(UsuariosEncontrados <= 0){
            return res.status(404).send({mensaje: 'No hay ningun libro'})
        }else{
            return res.status(200).send(UsuariosEncontrados)
        }
    }).sort({vecesvisto:-1}).limit(3);
}

function EditarLibros(req, res){

    var params = req.body;
    var userId = req.params.idU
    var userIdEditar = req.params.IdE

    if(params.palabrasclaves){
        var texto = params.palabrasclaves
        var posicion1 = texto.indexOf(",")
        var arraydatos = []

        if(posicion1 == -1){
            arraydatos.push(texto)
        }else{

        do{
            var posicion2 = texto.indexOf(",")
            var imprimirtexto = texto.substr(0, posicion2)
            arraydatos.push(imprimirtexto)
            posicion2 = posicion2+2
            texto = texto.substring(posicion2)
            var posicion1 = texto.indexOf(",")
        }while(posicion1 != -1 )
        arraydatos.push(texto)
        params.palabrasclaves = arraydatos
        }
    }

    if(params.Temas){
        var temas = params.Temas
        var arraytemas = []
        var posicion1 = temas.indexOf(",")

        if(posicion1 == -1){
            arraytemas.push(temas)
        }else{
            do{
                var posicion2 = temas.indexOf(",")
                var imprimirtexto = temas.substr(0, posicion2)
                arraytemas.push(imprimirtexto)
                posicion2 = posicion2+2
                temas = temas.substring(posicion2)
                var posicion1 = temas.indexOf(",")
            }while(posicion1 != -1)
            arraytemas.push(temas)
            params.Temas = arraytemas
        }
    }

    Usuario.findOne({ _id: userId, rol: "ADMIN"}, (err, usuariosEncontrado) =>{
        if (err) return res.status(404).send({mensaje: "Error en la petición de busqueda"});
        if(!usuariosEncontrado) return res.status(404).send({mensaje: "No tienes permiso para realizar esta petición"});

        Libros.findByIdAndUpdate(userIdEditar, params, {new: true}, (err, libroeditado) => {
            if(err) return res.status(500).send({mensaje: 'Error en la petición de editar'})
            if(!libroeditado) return res.status(404).send({mensaje: 'No se ha podido actualizar el libro'})
            return res.status(200).send(libroeditado)
        })
    })
}

function ELiminarUnLibro(req, res){
    var userId = req.params.idU
    var Eid = req.params.IdE

    Usuario.findOne({ _id: userId, rol: "ADMIN"}, (err, usuariosEncontrado) =>{
        if (err) return res.status(404).send({mensaje: "Error en la petición de busqueda"});
        if(!usuariosEncontrado) return res.status(404).send({mensaje: "No tienes permiso para realizar esta petición"});

        Libros.findByIdAndDelete(Eid, (err, eliminarusuario) => {
            if(err) return res.status(500).send({mensaje: 'Error en la petición de eliminar'})
            if(!eliminarusuario) return res.status(404).send({mensaje: 'No se ha podido eliminar el libro'})
            return res.status(200).send({mensaje: 'Su libro fue eliminado exitosamente'})
        })
    })
}


function PrestarLibros(req, res){

    var params = req.body;
    var ModeloPrestamos = new Prestamos();
    var fecha = new Date();

    Prestamos.findOne({iduser: params.iduser, idlibro: params.idlibro, estado: "prestado"}, (err, PrestamoEncontrado) => {
        if(err) return res.status(500).send({mensaje: 'Error en la petición de busqueda del prestamo'})

        if(PrestamoEncontrado){
            return res.status(404).send({mensaje: 'Este prestamo ya existe, devuelve primero el libro para renovar el prestamo'})
        }else{
            Usuario.findOne({carnet: params.iduser}, (err, UsuarioEncontrado) => {
                if(err) return res.status(500).send({mensaje: 'Error en la petición de busqueda de usuario'})
                if(!UsuarioEncontrado) return res.status(404).send({mensaje: 'Error en la busqueda de usuario'})

                Libros.findOne({ _id: params.idlibro}, (err, LibroEncontrado) =>{
                    if(err) return res.status(500).send({mensaje: 'Error en la petición de busqueda del libro'})
                    if(!LibroEncontrado) return res.status(404).send({mensaje: 'Error en la busqueda del documento'})

                    ModeloPrestamos.iduser = UsuarioEncontrado.carnet
                    ModeloPrestamos.idlibro = LibroEncontrado._id
                    ModeloPrestamos.img = LibroEncontrado.img
                    ModeloPrestamos.autor = LibroEncontrado.autor
                    ModeloPrestamos.name = LibroEncontrado.namec
                    ModeloPrestamos.edicion = LibroEncontrado.edicion
                    ModeloPrestamos.tipo =  LibroEncontrado.tipo
                    ModeloPrestamos.estado = "prestado"
                    ModeloPrestamos.fechadesolicitud = fecha.toLocaleDateString()
                    ModeloPrestamos.fechadeentrega = "Pendiente"

                    let dato = UsuarioEncontrado.librosprestados
                    let dato2 = LibroEncontrado.Dispobles

                    if(dato == 10 && dato <= 0){
                        return res.status(404).send({mensaje: "No puedes prestar mas libros"})
                    }else{
                        dato = dato+1
                    }

                    if(dato2 == 0){
                        return res.status(404).send({mensaje: "No hay ejemplares para prestar"})
                    }else{
                        dato2 = dato2-1
                    }

                    Usuario.updateOne({_id: UsuarioEncontrado._id},
                        {cantidaddedocuentosprestados: UsuarioEncontrado.cantidaddedocuentosprestados+1,
                         librosprestados: dato},
                        {new: true}, (err, editarusuario) => {
                            if(err) return res.status(500).send({mensaje: "Error en la petición de editar usuario"})
                            if(!editarusuario) return res.status(404).send({mensaje: "Error en la petición de edtiar usuario"})
                            
                            Libros.updateOne({_id: LibroEncontrado._id},
                                {Dispobles: dato2, 
                                cantidaddedocuentosprestados: LibroEncontrado.cantidaddedocuentosprestados+1,},
                                {new: true}, (err, LibroEditado) =>{
                                    if(err) return res.status(500).send({mensaje: "Error en la petición de editar el documento"})
                                    if(!LibroEditado) return res.status(404).send({mensaje: "Error en la petición de editar el documento"})
                                    
                                    ModeloPrestamos.save((err, PrestamoGuardado) => {
                                        if(err) return res.status(500).send({mensaje:"Error en la petición de guardado"})
                                        if(!PrestamoGuardado) return res.status(404).send({mensaje: "No se a podido realizar el prestamo"})
                                        res.status(200).send(PrestamoGuardado)
                                    })
                                })
                        })
                })
            })
        }
    })
}
   
function devolverlibro(req, res){
    var fecha = new Date();
    var params = req.body;

    Prestamos.updateOne({iduser: params.iduser, idlibro: params.idlibro},
                        {fechadeentrega: fecha.toLocaleDateString(),estado: "devuelto"},
                        {new: true}, (err, editarprestamo) =>{
        if(err) return res.status(500).send({mensaje: "Error en petición de editar prestamo"})
        if(!editarprestamo) return res.status(404).send({mensaje: "Error en la petición de editar prestamo"})
        
        Usuario.findOne({carnet: params.iduser},(err, UsuarioEncontrado) =>{
            if(err) return res.status(500).send({mensaje: "Error en la petición de busqueda de usuario"})
            if(!UsuarioEncontrado) return res.status(404).send({mensaje: "Error en la petición de busqueda de usuario"})

            Usuario.updateOne({carnet: params.iduser},
                {librosprestados: UsuarioEncontrado.librosprestados - 1},
                {new: true},(err, usuarioeditado) =>{
                 if(err) return res.status(500).send({mensaje: "Error en la petición de editar usuario"})
                 if(!usuarioeditado) return res.status(404).send({mensaje: "Error en la petición de edtiar usuario"})
                 
                Libros.findOne({ _id: params.idlibro}, (err, LibroEncontrado) =>{
                    if(err) return res.status(500).send({mensaje: 'Error en la petición de busqueda del documento'})
                    if(!LibroEncontrado) return res.status(404).send({mensaje: 'Error en la busqueda del documento'})
                    
                    Libros.updateOne({ _id: params.idlibro},{Dispobles: LibroEncontrado.Dispobles +1},
                        {new: true}, (err, LibroEditado) =>{
                            if(err) return res.status(500).send({mensaje: "Error en la petición de editar el documento"})
                            if(!LibroEditado) return res.status(404).send({mensaje: "Error en la petición de editar el documento"})
                            return res.status(200).send(editarprestamo)
                    })
                })
            })
        })
    })
}

function ObtenerPrestamosActivosDescendentes(req, res){
    var userId = req.params.idU

    Prestamos.find({estado: "prestado"}, (err, PrestamosActivos)=>{
        if(err) return res.status(500).send({mensaje: "Error en la petición de busqueda"})
        if(!PrestamosActivos) return res.status(404).send({mensaje: "Error en la petición de busqueda"})

        if(PrestamosActivos.length == 0){
            return res.status(404).send({mensaje: "No hay Prestaciones activas"})
        }else{
            return res.status(200).send(PrestamosActivos)
        }
    }).sort({fechadesolicitud:1});
}

function ObtenerPrestamosInactivosDescendentes(req, res){
    var userId = req.params.idU

    Prestamos.find({estado: "devuelto"}, (err, PrestamosActivos)=>{
        if(err) return res.status(500).send({mensaje: "Error en la petición de busqueda"})
        if(!PrestamosActivos) return res.status(404).send({mensaje: "Error en la petición de busqueda"})

        if(PrestamosActivos.length == 0){
            return res.status(404).send({mensaje: "No hay Prestaciones activas"})
        }else{
            return res.status(200).send(PrestamosActivos)
        }
    }).sort({fechadesolicitud:1});
}

function ObtenerUnSoloPrestamo(req,res){
    var libroid = req.params.idl
    Prestamos.findOne({ _id: libroid},(err, libroeditado) => {
        if(err) return res.status(500).send({mensaje: 'Error en la petición de busqueda'})
        if(!libroeditado) return res.status(404).send({mensaje: 'No existe hay documentos con este código'})
        return res.status(200).send(libroeditado)
    })
}

function ObtenerPrestamosPorUsuario(req,res){
    var Userid = req.params.idU
    Prestamos.find({ iduser: Userid, estado: "prestado"},(err, libroeditado) => {
        if(err) return res.status(500).send({mensaje: 'Error en la petición de editar'})
        if(!libroeditado) return res.status(404).send({mensaje: 'No existe prestamos echos por este usuario'})
        
        if(libroeditado.length != 0){
            return res.status(200).send(libroeditado)
        }else{
            return res.status(404).send({mensaje: 'No existe prestamos actualmente'})
        }
    }).sort({carnet:-1});
}

function ObtenerPDPorUsuairo(req, res){
    var Userid = req.params.idU
    Prestamos.find({ iduser: Userid, estado: "devuelto"},(err, libroeditado) => {
        if(err) return res.status(500).send({mensaje: 'Error en la petición de editar'})
        if(!libroeditado) return res.status(404).send({mensaje: 'No existe prestamos echos por este usuario'})
        
        if(libroeditado.length != 0){
            return res.status(200).send(libroeditado)
        }else{
            return res.status(404).send({mensaje: 'No existe prestamos actualmente'})
        }
    }).sort({carnet:-1});
}

function HistorialDeUsuarios(req, res){
    var Userid = req.params.idU
    Prestamos.find({ iduser: Userid},(err, libroeditado) => {
        if(err) return res.status(500).send({mensaje: 'Error en la petición de editar'})
        if(!libroeditado) return res.status(404).send({mensaje: 'No existe prestamos echos por este usuario'})
        
        if(libroeditado.length != 0){
            return res.status(200).send(libroeditado)
        }else{
            return res.status(404).send({mensaje: 'No existe prestamos actualmente'})
        }
    }).sort({carnet:-1});
}


function ObtenerPrestamoPorUsuarioyLibro(req, res){
    var Userid = req.params.idU
    var libroid = req.params.idl
    Prestamos.findOne({ iduser: Userid, idlibro: libroid, estado: "prestado"},(err, libroeditado) => {
        if(err) return res.status(500).send({mensaje: 'Error en la petición de busqueda'})
        if(!libroeditado) return res.status(404).send({mensaje: 'No existe hay documentos con este código'})
        return res.status(200).send(libroeditado)
    })
}

function ObtenerTodosLosPrestamos(req, res){
    Prestamos.find({},(err, libroeditado) => {
        if(err) return res.status(500).send({mensaje: 'Error en la petición de busqueda'})
        if(!libroeditado) return res.status(404).send({mensaje: 'Error en la busqueda.'})

        if(libroeditado.length != 0){
            return res.status(200).send(libroeditado)
        }else{
            return res.status(404).send({mensaje: 'No hay prestaciones echas.'}) 
        }
    }).sort({fechadesolicitud:1});
}

function ObtenerLosDocumentosMasPrestados(req, res){
    Libros.find((err, PrestamosEncontrado) => {
        if (err) return res.status(404).send({mensaje: "Error en la petición de busqueda"});
        if(!PrestamosEncontrado) return res.status(404).send({mensaje: "Error en la petición de busqueda"});
        return res.status(200).send(PrestamosEncontrado)
    }).sort({cantidaddedocuentosprestados:-1}).limit(10);
}

module.exports = {
    AgregarUnNuevoLibro,
    buscarporpalabrasclaves,
    ObtenerTodosLosLibros,
    ObtenerUnSoloLibro,
    ObtenerTodasLasRevistas,
    EditarLibros,
    ELiminarUnLibro,
    PrestarLibros,
    devolverlibro,
    ObtenerDocumentosMasVistos,
    ObtenerUnSoloPrestamo,
    ObtenerPrestamosPorUsuario,
    ObtenerPrestamoPorUsuarioyLibro,
    ObtenerTodosLosPrestamos,
    ObtenerPrestamosActivosDescendentes,
    ObtenerPrestamosInactivosDescendentes,
    ObtenerTodoLosDocumentos,
    ObtenerPDPorUsuairo,
    HistorialDeUsuarios,
    ObtenerLosDocumentosMasPrestados
}