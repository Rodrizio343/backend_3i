const express = require("express");
const app = express();

app.get('/usuario', function(req, res) { //req(solicitud) / res(respuesta)
    res.json({
        message:'GET usuario'
    });
});

app.post('/usuario', function(req, res) { //req(solicitud) / res(respuesta)
    res.json({
        message:'POST usuario'
    });
});

app.put('/usuario', function(req, res) { //req(solicitud) / res(respuesta)
    res.json({
        message:'PUT usuario'
    });
});

app.delete('/usuario', function(req, res) { //req(solicitud) / res(respuesta)
    res.json({
        message:'DELETE usuario'
    });
});

app.listen(3000, ()=>{
    console.log('Servidor online en puerto ', 3000)
})