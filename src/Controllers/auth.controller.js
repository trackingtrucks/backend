import Usuario from '../Models/Usuario'
import Role from '../Models/Role'
import jwt from 'jsonwebtoken'
import config from '../config'
const secret = config.SECRET;
const refresh_secret = config.REFRESH_SECRET;
const token_expires = config.ACCESS_TOKEN_EXPIRES;
const refresh_expires = config.REFRESH_TOKEN_EXPIRES;

/*
############
# ACCIONES #
############
*/

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
    const gestorRole = await Role.findOne({ nombre: "gestor" }) //busca la id del rol de "gestor"
    nuevoUsuario.roles = [gestorRole._id] //le asigna el rol de gestor al objeto del nuevo usuario (puedo hacer esto ya que todavia no lo envie a la db)
    const userNuevo = await nuevoUsuario.save(); //enviando el nuevo usuario a la base de datos, a partir de ahora no lo puedo modificar sin hacer un request a la db

    res.status(200).json({ userNuevo })
}

export const registrarConductor = async (req, res) => {
    //ver comentarios en registrarGestor()
    const { companyId } = req.userData;
    const { nombre, apellido, email, password, registerToken } = req.body;
    if (!nombre || !email || !password || !companyId) return res.status(401).json({ message: "Faltan 1 o mas campos requeridos" })
    // Se crea el objecto con el nuevo usuario
    const nuevoUsuario = new Usuario({
        nombre,
        apellido,
        email,
        companyId,
        //el agregadoPor es para tener un registro de quien fue la persona que añadió al conductor, en caso de que sea una compania con muchos gestores / un equipo grande
        agregadoPor: {
            id: req.userData._id,
            email: req.userData.email,
            fecha: new Date().toLocaleString(),
            date: new Date()
        },
        password: await Usuario.encriptarPassword(password)
    })
    const roleVacio = await Role.findOne({ nombre: "conductor" })
    nuevoUsuario.roles = [roleVacio._id]
    const userNuevo = await nuevoUsuario.save();

    res.status(200).json({ userNuevo })
}


export const registrarAdmin = async (req, res) => {
    try {
        const { nombre, apellido, email, password } = req.body;
        if (!nombre || !email || !password) return res.status(401).json({ message: "Faltan 1 o mas campos requeridos" })
        const nuevoUsuario = new Usuario({
            nombre,
            apellido,
            email,
            companyId: 'admins',
            password: await Usuario.encriptarPassword(password)
        })
        const adminRole = await Role.findOne({ nombre: "admin" })
        const refreshToken = generateRefreshToken(nuevoUsuario._id)
        nuevoUsuario.roles = [adminRole._id]
        nuevoUsuario.refreshTokens = [refreshToken]
        const userNuevo = await nuevoUsuario.save();
        res.status(200).json({
            userNuevo,
            accessToken: generateAccessToken(nuevoUsuario._id, refreshToken),
            refreshToken
        }) //envio como respuesta el access token, que va a durar 24hs, y el refresh token, que dura 7 dias.
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}



export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!password) return res.status(401).json({ message: 'Contraseña invalida' })
    //busco si el usuario existe, y le concateno los roles, que los saco de la otra tabla (ya que relacione los parametros)
    const userEnDB = await Usuario.findOne({ email }).populate("roles");

    if (!userEnDB) { return res.status(400).json({ message: 'Usuario no encontrado' }) }//si el mail no se encontró

    const contraseñasCoinciden = await Usuario.verificarPassword(password, userEnDB.password)//chequeo de contraseña
    if (!contraseñasCoinciden) { return res.status(401).json({ accessToken: null, message: 'Contraseña invalida' }) }

    //creo el token de login y de refresh
    const refreshToken = generateRefreshToken(userEnDB._id)
    const accessToken = generateAccessToken(userEnDB._id, refreshToken)

    const response = await Usuario.findByIdAndUpdate(userEnDB._id, { $push: { refreshTokens: [refreshToken] } }, { new: true })

    response.refreshTokens = null; response.password = null; //limpiando, para que en la respuesta no se envien estos datos
    res.json({ response, accessToken, refreshToken })//envio como respuesta el token, que va a durar 24hs
}


export const logout = async (req, res) => {
    try {
        const refreshToken = req.headers["x-refresh-token"] //agarro el refresh token que se me envio y lo guardo
        await Usuario.findByIdAndUpdate(req.userId, { $pullAll: { refreshTokens: [refreshToken] } }, { new: true }) //elimino SOLO ese refresh token del usuario
        res.status(204).json({ message: 'Sesiones cerrada', success: true }) //envio el "ok"

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const newAccessToken = async (req, res) => {
    try {
        const refreshToken = req.headers["x-refresh-token"]//agarro el refresh token que se me envio y lo guardo
        const decoded = verifyRefreshToken(refreshToken) //chequeo si es valido y guardo la data
        const usuarioEnDb = await Usuario.findById(decoded.id, { password: 0 }) //busco el usuario en la base de datos mediante la id que decodeé arriba. No lo hice en el middleware ya que no le pido al usuario un accesstoken, asi que no puedo acceder a la req.userData
        if (!usuarioEnDb.refreshTokens.includes(refreshToken)) return res.status(403).json({ message: 'Refresh token revoked' }) //chequea si el refresh token está habilitado por el usuario y no fue revocado (caso que se desloguee)
        res.json({ accessToken: generateAccessToken(decoded.id, refreshToken) }) //envio el nuevo accessToken
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const logoutAllDevices = async (req, res) => {
    try {
        if (!req.body.password) return res.status(401).json({ message: 'Contraseña invalida' }) //chequeo si envió una contraseña
        const contraseñasCoinciden = await Usuario.verificarPassword(req.body.password, req.userData.password) // chequeo si la contraseña es valida
        if (!contraseñasCoinciden) return res.status(403).json({ message: 'Contraseña invalida' }) //si no es valida, devuelvo un error
        await Usuario.findByIdAndUpdate(req.userId, { refreshTokens: [] }, { new: true }) //elimino todos los refresh tokens del usuario
        res.status(204).json({ message: 'Sesiones cerradas', success: true }) //envio una confirmacion
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

/*
#############
# FUNCIONES #
#############
*/

function generateAccessToken(id, refreshToken) {
    const accessToken = jwt.sign({
        id,
        gen: refreshToken
    }, secret, {
        expiresIn: token_expires // 24 horas
    })
    return accessToken
}

function generateRefreshToken(id) {
    const refreshToken = jwt.sign({ //creo el token de refreshing
        id: id,
    }, refresh_secret, {
        expiresIn: refresh_expires
    })
    return refreshToken
}
function verifyRefreshToken(token) {
    return jwt.verify(token, refresh_secret)
}
function verifyAccessToken(token) {
    return jwt.verify(token, secret)
}