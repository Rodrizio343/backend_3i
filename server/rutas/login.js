const express = require("express");
//para encriptar
const bcrypt = require("bcrypt");

//para generar tokens
const jwt = require('jsonwebtoken');

const Usuario = require('../modelos/usuario');

const app = express();

app.post('/login', (req,res) => {

    let body = req.body;

    //se usa metodo de mongoose para buscar en el modelo usuarios na unica coincidencia, buscan la propiedad email en body
    Usuario.findOne({email:body.email}, (err,usuarioDB) => {

        //Se controla cualquier error inesperado (500)

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        };

        //Se controla error porque no existe usuario

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: "Usuario o contraseña incorrectos",
                }
            });
        };

        //Se controla error por contraseña incorrecta

        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                err:{
                    message: "Usuario o contraseña incorrectos",
                }
            });
        };


        /*Una vez verificadas las credenciales, antes de recibir la respuesta a la petición, se genera el token
        a travez de el metodo sign de jwt, que recibe 3 parametros, primero el payload(contenido), el segundo la firma(clave)
        y por ultimo opcional la fecha de expiracion en el formato pre-estabecido */
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN})

        res.json({
            ok:true,
            usuario: usuarioDB,
            token: token,
        })
    });
}); 


module.exports = app;