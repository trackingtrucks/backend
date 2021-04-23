import Usuario from '../Models/Usuario'
import Role from '../Models/Role'
import jwt from 'jsonwebtoken'
import config from '../config'
const secret = config.SECRET;

export const register = async (req, res) => {
    /*
    const { username, email, password, roles } = req.body;
    // Se crea el objecto con el nuevo usuario
    const newUser = new Usuario({
        username,
        email,
        password: await Usuario.encriptarPassword(password) //encripto la contraseña, con el hash de bcrypt
    })
    //busco los roles
    if (roles) {
        const rolesEncontrados = await Role.find({ nombre: { $in: roles } });
        newUser.roles = rolesEncontrados.map((role) => role._id)
    } else {
        const roleVacio = await Role.findOne({ nombre: "user" })
        newUser.roles = [roleVacio._id]
    }
    //guardo el usuario en la base de datos
    const userNuevo = await newUser.save();

    //creo el token de login
    const token = jwt.sign({
        id: userNuevo._id,
    }, secret, {
        expiresIn: 86400 // 24 horas
    })
    res.status(200).json({ token }) //envio como respuesta el token, que va a durar 24hs
    */
   res.json('register json')
}

export const login = async (req, res) => {
     /*
     const { email, password } = req.body;
    //busco si el usuario existe, y le concateno los roles, que los saco de la otra tabla
    const userEnDB = await Usuario.findOne({ email }).populate("roles");

    if (!userEnDB) {    //si el usuario no lo encontró
        return res.status(400).json({ message: 'usuario no encontrado' })
    }
    const contraseñasCoinciden = await Usuario.verificarPassword(password, userEnDB.password)     //chequeo de contraseña

    if (!contraseñasCoinciden){
        return res.status(401).json({token: null, message: 'Contraseña invalida'})
    }
    //creo el token de login
    const token = jwt.sign({
        id: userEnDB._id,
    }, secret, {
        expiresIn: 86400 // 24 horas
    })
    
    res.json({token})//envio como respuesta el token, que va a durar 24hs

    */
   res.json('login')
}