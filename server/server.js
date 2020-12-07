//para importar, los require siempre arriba
require('./config/config')

const express = require("express");
const bodyParser= require("body-parser")
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/usuario', function(req, res) { //req(solicitud) / res(respuesta)
    res.json({
        message:'GET usuario'
    });
});

app.post('/usuario', function(req, res) { //req(solicitud) / res(respuesta)
    
    let body = req.body

    if(body.nombre===undefined){
        res.status(400).json({
            ok:false,
            message: "El nombre es necesario",
        })
    } else{
        res.json({
            // message:'POST usuario'
            persona:body
        });
    }
    
});

app.put('/usuario/:id', function(req, res) { //req(solicitud) / res(respuesta)
    res.json({
        message:'PUT usuario'
    });
});

app.delete('/usuario', function(req, res) { //req(solicitud) / res(respuesta)
    res.json({
        message:'DELETE usuario'
    });
});

app.listen(process.env.PORT, ()=>{
    console.log('Servidor online en puerto ', process.env.PORT)
})