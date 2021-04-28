import Usuario from '../Models/Usuario'
import Role from '../Models/Role'
import jwt from 'jsonwebtoken'
import config from '../config'
const secret = config.SECRET;
const refresh_secret = config.REFRESH_SECRET;
const token_expires = config.ACCESS_TOKEN_EXPIRES;
const refresh_expires = config.REFRESH_TOKEN_EXPIRES;
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

    //creo el access token de login
    const accessToken = jwt.sign({
        id: userNuevo._id
    }, secret, {
        expiresIn: token_expires
    })
    res.status(200).json({ userNuevo, accessToken })
}

export const registrarConductor = async (req, res) => {
    // return res.json(req.userData.companyId)
    const { companyId } = req.userData;
    const { nombre, apellido, email, password, registerToken } = req.body;
    if (!nombre || !email || !password || !companyId) return res.status(401).json({ message: "Faltan 1 o mas campos requeridos" })
    // Se crea el objecto con el nuevo usuario
    const nuevoUsuario = new Usuario({
        nombre,
        apellido,
        email,
        companyId,
        agregadoPor: {
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

    const accessToken = jwt.sign({
        id: userNuevo._id,
    }, secret, {
        expiresIn: token_expires // 24 horas
    })

    res.status(200).json({ userNuevo, accessToken }) //envio como respuesta el token, que va a durar 24hs
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

    //creo el access token de login
    const accessToken = jwt.sign({
        id: userNuevo._id
    }, secret, {
        expiresIn: token_expires // 24 horas
    })
    res.status(200).json({ userNuevo, accessToken }) //envio como respuesta el access token, que va a durar 24hs


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
        return res.status(401).json({ accessToken: null, message: 'Contraseña invalida' })
    }
    //creo el token de login
    const accessToken = jwt.sign({
        id: userEnDB._id,
    }, secret, {
        expiresIn: token_expires // 24 horas
    })
    const refreshToken = jwt.sign({ //creo el token de refreshing
        id: userEnDB._id,
    }, refresh_secret, {
        expiresIn: refresh_expires
    })
    const response = await Usuario.findByIdAndUpdate(userEnDB._id, { $push: { refreshTokens: [refreshToken] } }, { new: true })
    // const response = await Usuario.findByIdAndUpdate(userEnDB._id, { ...userEnDB, refreshTokens: userEnDB.refreshTokens.push(refreshToken) }, { new: true })
    response.refreshTokens = null; response.password = null; //limpiando, para que en la respuesta no se envien estos datos
    res.json({ response, accessToken, refreshToken })//envio como respuesta el token, que va a durar 24hs
}

export const logout = async (req, res) => {
    try {
        const refreshToken = req.headers["x-refresh-token"]
        const id = req.userId
        const debugResponse = await Usuario.findByIdAndUpdate(id, { $pullAll: { refreshTokens: [refreshToken] } }, { new: true })
        res.json({ message: 'Sesion cerrada con exito', debug: debugResponse }).status(204)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const newAccessToken = async (req, res) => {
    try {
        const refreshToken = req.headers["x-refresh-token"]
        const {id} = jwt.verify(refreshToken, refresh_secret)
        const accessToken = jwt.sign({
            id
        }, secret, {
            expiresIn: token_expires // 24 horas
        })
        res.json({accessToken})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const logoutAllDevices = async (req, res) => {
    try {
        const id = req.userId
        const debugResponse = await Usuario.findByIdAndUpdate(id, { refreshTokens: [] }, { new: true })
        res.json({debugResponse})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
