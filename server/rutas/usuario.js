const express = require("express");
//para encriptar
const bcrypt = require("bcrypt")
//para realizar validadciones de metodo PUT, se referencia underscore como _
const _=require('underscore')
const app = express();
const Usuario = require('../modelos/usuario')

/*-------------------------
        METODO GET
---------------------------*/
app.get('/usuario', function(req, res) { //req(solicitud) / res(respuesta)
    let desde = req.query.desde || 0;
    desde = Number(desde)

    let limite = req.query.limite || 5;
    limite = Number(limite)

    //dentro de las llaves se ponen los filtros que urilizara find para mostrar los productos
    Usuario.find({ estado:true })
    //mostrar a partir del registro 5
    .skip(desde)
    //metodo para limitar la cantidad de registros a mostrar
    .limit(limite)
    //metodo para ejecutar el find
    .exec((err, usuarios)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        };

        //Contador para ver la cantidad de registros en el modelo
        Usuario.count({ estado:true }, (err, conteo)=>{

            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                });
            }

            res.json({
                ok:true,
                usuarios,
                cantidad: conteo,
            });
        });
    });

    
    // res.json({
    //     message:'GET usuario'
    // });
});

/*-------------------------
        METODO POST
---------------------------*/
app.post('/usuario', function(req, res) { //req(solicitud) / res(respuesta)
    
    let body = req.body

    //crear instancia del modelo Usuario (importado arriba)
    //al crear la instancia(es un objeto) defino sus propiedades, que toman los valores de body(que tambien es un objeto)
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        //encriptar contraseña, el metodo lleva dos argumentos (el segundo opcional, indica cantidad de vuelta a encriptar)
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })
    
    //metodo save de mongoose, recibe un callback
    usuario.save(( err, usuarioDB) => {
        //primero se maneja el error, retornado error 400, el ok false porque siempres un erro y por ultimo el erroren sí, todo en formato json
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        };

        //respuesta positiva (se guarda el usuario en base de datos)
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

    //EJEMPLO PARA PROBAR LA RUTA, SOLO ENVIA EL BODY Y LO MUETSRA EN LA RESPUESTA, NO ALMACENA NADA EN LA BASE DE DATOS
    // if(body.nombre===undefined){
    //     res.status(400).json({
    //         ok:false,
    //         message: "El nombre es necesario",
    //     })
    // } else{
    //     res.json({
    //         // message:'POST usuario'
    //         persona:body
    //     });
    // }
    
});


/*-------------------------
        METODO PUT
---------------------------*/

app.put('/usuario/:id', function(req, res) { //req(solicitud) / res(respuesta)
    let id=req.params.id;
    //body viene de body-parser
    //con _.pick, especifico que parametros del body se podran actualizar con el metodo PUT
    let body=_.pick(req.body,['nombre','email','img','role','estado']);
    //para actualizar se utiliza el metodo de mongoose, que recibe dos parametros (id, body, callback)
    //new es una opcion de mongoose que nos permite traer el registro modificado (no el original), al hacer el PUT
    //runValidators activa las funciones de validacion en put
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB)=> {
        if(err){
            return res.status(400).json({   
                ok: false,
                err,
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB,
        });
    });
    
    // res.json({
    //     message:'PUT usuario'
    // });
});

/*-------------------------
        METODO DELETE
---------------------------*/

app.delete('/usuario/:id', function(req, res) { //req(solicitud) / res(respuesta)
    let id=req.params.id;

    let estadoActualizado = {
        estado: false,
    }

    Usuario.findByIdAndUpdate(id, estadoActualizado, {new: true}, (err, usuarioBorrado) => {
        if(err){
            return res.status(400).json({   
                ok: false,
                err,
            });
        }

        //En caso de que se quiera borrar un usuario que ya ha sido borrado
        if(!usuarioBorrado){
            return res.status(400).json({   
                ok: false,
                message: "Usuario no encontrado",
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado,
        });
    });
    
    // res.json({
    //     message:'DELETE usuario'
    // });
});

module.exports = app;