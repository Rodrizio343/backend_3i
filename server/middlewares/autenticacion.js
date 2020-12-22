/*para mayor seguridad, se mandan tokens por headers, entonces primero se verifica si el token es valido
antes de realizar cualquier peticion. Si no es valido el usuario no podra realizar ninguna peticion*/

const jwt = require('jsonwebtoken')

//lo que ponga en headers se va a almacenar en la variable token

let verificaToken= (req,res,next) => {

    //con req.get traigo lo que esta almacenado en header, en este caso bajo la clave 'token
    let token = req.get('token');

    jwt.verify(token,process.env.SEED, (err,decoded) => {

        if(err){
            return res.status(401).json({
                ok:false,
                err:{
                    message:'Token no válido'
                }
            })
        }

        //En caso de que se verifique, la informcion de payload e almacena en req.usuario

        req.usuario = decoded.usuario;
        
        //una vez que se verifique, sigue el next

        next();

    })

    // res.json({
    //     token:token,
    // });
}


let verificaAdminRole = (req,res,next) => {
    
    let usuario = req.usuario;

    if(usuario.role === 'ADMIN_ROLE'){
        next();
    } else {
        return res.json({
            ok:false,
            err:{
                message: 'El usuario no es administrador'
            }
        })
    }

}
module.exports = {verificaToken, verificaAdminRole}