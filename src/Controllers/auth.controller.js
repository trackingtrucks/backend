import Usuario from '../Models/Usuario';
import jwt from 'jsonwebtoken';
import config from '../config';
import Token from '../Models/Token';

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
    const { nombre, apellido, email, password } = req.body; //agarro lo que envia el usuario en el body del request
    if (req.isAdmin && !req.body.companyId) { return res.status(401).json({ message: 'Faltan 1 o mas campos requeridos' }) }; //En caso de que sea admin, chequeo que haya suministrado un companyId
    if (req.isAdmin && req.body.companyId) { req.companyIdValido = req.body.companyId }; //en caso que sea admin, pone el companyId en el suminstrado
    if (req.rolValido !== "gestor" && !req.isAdmin) return res.status(401).json({ message: 'Su codigo no es valido para realizar esta accion' }); //chequea que el codigo pueda crear gestores
    if (!nombre || !email || !password) return res.status(401).json({ message: "Faltan 1 o mas campos requeridos" }); //pregunta si falta algun campo suminstrado por el usuario
    // Se crea el objecto con el nuevo usuario
    const nuevoUsuario = new Usuario({
        nombre,
        apellido,
        email,
        companyId: req.companyIdValido,
        rol: 'gestor',
        password: await Usuario.encriptarPassword(password) //llamo a la funcion de encriptarPassword, guardada en el modelo de Usuario
    })
    const userNuevo = await nuevoUsuario.save(); //enviando el nuevo usuario a la base de datos, a partir de ahora no lo puedo modificar sin hacer un request a la db
    await Token.findByIdAndDelete(req.codigoValido) //elmino el token de registro, para q no se puedan crear mas cuentas de las permitidas
    res.status(200).json({ userNuevo })
}

export const registrarConductor = async (req, res) => {
    //ver comentarios en registrarGestor()
    const { nombre, apellido, email, password } = req.body;
    if (req.isAdmin && !req.body.companyId) { return res.status(401).json({ message: 'Faltan 1 o mas campos requeridos' }) }
    if (req.isAdmin && req.body.companyId) { req.companyIdValido = req.body.companyId; req.gestorData = {id: req.userId, email: req.userData.email}}
    if (req.rolValido !== "conductor" && !req.isAdmin) return res.status(401).json({ message: 'Su codigo no es valido para realizar esta accion' })
    if (!nombre || !email || !password) return res.status(401).json({ message: "Faltan 1 o mas campos requeridos" })
    // Se crea el objecto con el nuevo usuario
    const nuevoUsuario = new Usuario({
        nombre,
        apellido,
        email,
        companyId: req.companyIdValido,
        agregadoPor: {
            id: req.gestorData.id,
            email: req.gestorData.email,
            fecha: new Date().toLocaleString(),
            date: new Date()
        },
        rol: 'conductor',
        password: await Usuario.encriptarPassword(password) //llamo a la funcion de encriptarPassword, guardada en el modelo de Usuario
    })
    const userNuevo = await nuevoUsuario.save(); //enviando el nuevo usuario a la base de datos, a partir de ahora no lo puedo modificar sin hacer un request a la db
    await Token.findByIdAndDelete(req.codigoValido)
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
            rol: 'admin',
            password: await Usuario.encriptarPassword(password)
        })
        const refreshToken = generateRefreshToken(nuevoUsuario._id)
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
    //busco si el usuario existe
    const userEnDB = await Usuario.findOne({ email })

    if (!userEnDB) { return res.status(400).json({ message: 'Usuario no encontrado' }) }//si el mail no se encontró

    const contraseñasCoinciden = await Usuario.verificarPassword(password, userEnDB.password)//chequeo de contraseña
    if (!contraseñasCoinciden) { return res.status(401).json({ accessToken: null, message: 'Contraseña invalida' }) }

    //creo el token de login y de refresh
    const refreshToken = generateRefreshToken(userEnDB._id)
    const accessToken = generateAccessToken(userEnDB._id, refreshToken)

    const response = await Usuario.findByIdAndUpdate(userEnDB._id, { $push: { refreshTokens: [refreshToken] } }, { new: true })

    response.refreshTokens = null; response.password = null; //limpiando, para que en la respuesta no se envien estos datos
    res.json({ response, accessToken, refreshToken, ATExpiresIn: Date.now() + token_expires * 1000, RTExpiresIn: Date.now() + refresh_expires * 1000})//envio como respuesta el token, que va a durar 12hs
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