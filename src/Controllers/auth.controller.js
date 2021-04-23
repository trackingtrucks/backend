import Usuario from '../Models/Usuario'
import Role from '../Models/Role'
import jwt from 'jsonwebtoken'
import config from '../config'
const secret = config.SECRET;

export const registrarGestor = async (req, res) => {
    const { nombre, apellido, email, password, companyId, registerToken } = req.body;
    if (!nombre || !email || !password || !companyId) return res.status(401).json({ message: "Faltan 1 o mas campos requeridos" })
    // Se crea el objecto con el nuevo usuario
    const nuevoUsuario = new Usuario({
        nombre,
        apellido,
        email,
        companyId,
        password: await Usuario.encriptarPassword(password) //llamo a la funcion de encriptarPassword, guardada en el modelo de Usuario
    })
    const gestorRole = await Role.findOne({ nombre: "gestor" })
    nuevoUsuario.roles = [gestorRole._id]
    const userNuevo = await nuevoUsuario.save();

    //creo el token de login
    const token = jwt.sign({
        id: userNuevo._id
    }, secret, {
        expiresIn: 86400 // 24 horas
    })
    res.status(200).json({ userNuevo, token })
}

export const registrarConductor = async (req, res) => {
    // return res.json(req.userData)
    const { nombre, apellido, email, password, companyId, registerToken } = req.body;
    if (!nombre || !email || !password || !companyId) return res.status(401).json({ message: "Faltan 1 o mas campos requeridos" })
    // Se crea el objecto con el nuevo usuario
    const nuevoUsuario = new Usuario({
        nombre,
        apellido,
        email,
        companyId,
        agregadoPor:{
            id: req.userData._id,
            email: req.userData.email,
            fecha: new Date().toLocaleString(),
            date: new Date()
        },
        password: await Usuario.encriptarPassword(password) //llamo a la funcion de encriptarPassword, guardada en el modelo de Usuario
    })
    const roleVacio = await Role.findOne({ nombre: "conductor" })
    nuevoUsuario.roles = [roleVacio._id]
    const userNuevo = await nuevoUsuario.save();

    const token = jwt.sign({
        id: userNuevo._id,
    }, secret, {
        expiresIn: 86400 // 24 horas
    })

    res.status(200).json({ userNuevo, token }) //envio como respuesta el token, que va a durar 24hs
}


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



export const login = async (req, res) => {
    const { email, password } = req.body;
    //busco si el usuario existe, y le concateno los roles, que los saco de la otra tabla
    const userEnDB = await Usuario.findOne({ email }).populate("roles");

    if (!userEnDB) {    //si el usuario no lo encontró
        return res.status(400).json({ message: 'usuario no encontrado' })
    }
    const contraseñasCoinciden = await Usuario.verificarPassword(password, userEnDB.password)     //chequeo de contraseña

    if (!contraseñasCoinciden) {
        return res.status(401).json({ token: null, message: 'Contraseña invalida' })
    }
    //creo el token de login
    const token = jwt.sign({
        id: userEnDB._id,
    }, secret, {
        expiresIn: 86400 // 24 horas
    })

    res.json({ userEnDB, token })//envio como respuesta el token, que va a durar 24hs
}