const mongoose = require("mongoose")

//el paquete validator ayuda a manejar mejo los errores de validacion unique, se usa en los esquemas 
const uniqueValidator = require('mongoose-unique-validator');

//para validar roles
let rolesValidos = {
    values: ["USER_ROLE", "ADMIN_ROLE"],
    message: "{VALUE} no es un rol válido"
};

//La variable toma todas la funcionalidades de mongoose. Este paso es como crear una clase.
let Schema = mongoose.Schema;

// se crea el esquema o tabla usuario, donde se define los valores que debe recibir y tipo de valor
let usuarioSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es necesario'],
        trim: true /*elimina esacios en blanco*/
    },
    email:{
        type:String,
        required: [true, 'El email es necesario'],
        trim: true,
        //para validar
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        //para validar roles
        enum: rolesValidos, 
        trim: true
    },
    estado: {
        type: Boolean,
        default: true
    },
    //Especifica la hora a la que se creo el usuario, dato de interes para admin
    created_at:{
        type: Date,
        default: Date.now()
    }
});

//se usa el metodo plugin de mongoose, el path indica el valor a validar
usuarioSchema.plugin(uniqueValidator,{
    message: "{PATH} debe ser unico"
});

//para mostrar password al realizar una petición
//this hace refernecia a usuarioSchema, lo convierto a objeto y elimino la propiedad password. Luego retorno el objeto
usuarioSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password; 
    return userObject;
}

//se especifica que lo que se expor es un modelo de mongoose, el nombre de la clase y el esquema
module.exports=mongoose.model('Usuario', usuarioSchema)