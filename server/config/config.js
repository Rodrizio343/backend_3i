//=========PUERTO============
//proporciona info de todos los procesos que estan funcionando en node, por ejemplo el puerto en el cual esta el servidor
//con esta sentencia defino la info del puerto cuando el proyecto este en produccion y/o en su defecto indico el puerto que empleara cuado este corriendo de forma local
process.env.PORT=process.env.PORT || 3005


//========DEFINIR ENTORNO=========
//Si estoy en un entorno de desarrollo (local) o de produccion (nube)
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//========DEFINIR BASE DE DATOS=========
let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/rolling'
} else {
    urlDB = process.env.MONGO_URI;
    // 'mongodb+srv://user:rollingcode2020@cluster0.enaty.mongodb.net/rolling'
    //se configra esta variable de entorno para evitar que se vean los datos de labase de datos
}

process.env.URLDB = urlDB;

//========CADUCIDAD TOKEN=========
process.env.CADUCIDAD_TOKEN='48h';

//========SEED=========
process.env.SEED = process.env.SEED || 'este_es_el_seed';
