import Usuario from '../Models/Usuario'
import Role from '../Models/Role'
import jwt from 'jsonwebtoken'
import config from '../config'
const secret = config.SECRET;

export const registrarAdmin = async (req, res) => {
    const { nombre, apellido, email, password } = req.body;
    if (!nombre || !email || !password) return res.status(401).json({ message: "Faltan 1 o mas campos requeridos" })
    // Se crea el objecto con el nuevo usuario
    const nuevoUsuario = new Usuario({
        nombre,
        apellido,
        email,
        companyId: 'admins',
        password: await Usuario.encriptarPassword(password) //llamo a la funcion de encriptarPassword, guardada en el modelo de Usuario
    })
    const adminRole = await Role.findOne({ nombre: "admin" })
    nuevoUsuario.roles = [adminRole._id]
    const userNuevo = await nuevoUsuario.save();

    //creo el token de login
    const token = jwt.sign({
        id: userNuevo._id
    }, secret, {
        expiresIn: 86400 // 24 horas
    })
    res.status(200).json({ userNuevo, token }) //envio como respuesta el token, que va a durar 24hs
}