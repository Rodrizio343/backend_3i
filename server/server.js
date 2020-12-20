//para importar, los require siempre arriba
require('./config/config')

const express = require("express");
const mongoose = require("mongoose")
const bodyParser= require("body-parser")
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(require('./rutas/usuario'))


//Craemos conexion con mongoDB

mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}, (err, res)=>{
    if (err) throw err;
    console.log('Base de datos online')
});

app.listen(process.env.PORT, ()=>{
    console.log('Servidor online en puerto ', process.env.PORT)
})