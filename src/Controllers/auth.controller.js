import Usuario from '../Models/Usuario';
import jwt from 'jsonwebtoken';
import config from '../config';
import Token from '../Models/Token';
import sha256 from 'js-sha256';
import { companyUpdate } from '../index'
import {cerrarSesion, cerrarSesionTodosLosDispositivos} from '../Libs/socketCache'
const secret = config.SECRET;
const refresh_secret = config.REFRESH_SECRET;
const token_expires = config.ACCESS_TOKEN_EXPIRES;
const refresh_expires = config.REFRESH_TOKEN_EXPIRES;
const salt = config.SALT;

/*
############
# ACCIONES #
############
*/

export const registrar = async (req, res) => {
    try {
        const { nombre, apellido, email, password } = req.body; //agarro lo que envia el usuario en el body del request
        if (!nombre || !email || !password) return res.status(401).json({ message: "Faltan 1 o mas campos requeridos" }); //pregunta si falta algun campo suminstrado por el usuario
        // Se crea el objecto con el nuevo usuario
        const nuevoUsuario = new Usuario({
            nombre,
            apellido,
            email: email.toLowerCase(),
            companyId: req.companyIdValido,
            rol: req.rolValido,
            password: await Usuario.encriptarPassword(password) //llamo a la funcion de encriptarPassword, guardada en el modelo de Usuario
        })
        await Token.findByIdAndDelete(req.codigoValido) //elmino el token de registro, para q no se puedan crear mas cuentas de las permitidas
        if (req.rolValido === 'gestor' || req.rolValido === "admin") {
            const refreshToken = generateRefreshToken(nuevoUsuario._id)
            nuevoUsuario.refreshTokens = [refreshToken]
            const userNuevo = await nuevoUsuario.save(); //enviando el nuevo usuario a la base de datos, a partir de ahora no lo puedo modificar sin hacer un request a la db
            companyUpdate(req.companyIdValido)

            return res.status(200).json({
                perfil: userNuevo,
                accessToken: generateAccessToken(nuevoUsuario._id, refreshToken),
                refreshToken
            }) //envio como respuesta el access token, que va a durar 24hs, y el refresh token, que dura 7 dias.

        }
        if (req.rolValido === 'conductor') {
            nuevoUsuario.agregadoPor = {
                id: req.gestorData.id,
                email: req.gestorData.email,
                fecha: new Date().toLocaleString(),
                date: new Date()
            }
            const userNuevo = await nuevoUsuario.save(); //enviando el nuevo usuario a la base de datos, a partir de ahora no lo puedo modificar sin hacer un request a la db
            companyUpdate(req.companyIdValido)

            return res.status(200).json({ perfil: userNuevo, message: "Usuario creado con ??xito!" })
        }
        return res.status(500).json({ message: "how did we get here?" }) //esto no se deveria activar nunca pero buenos 
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!password) return res.status(401).json({ message: 'Usuario o contrase??a invalidos.' })
    //busco si el usuario existe
    const userEnDB = await Usuario.findOne({ email: email.toLowerCase() }).select("+password").select("+refreshTokens")

    if (!userEnDB) { return res.status(400).json({ message: 'Usuario o contrase??a invalidos.' }) }//si el mail no se encontr??

    const contrase??asCoinciden = await Usuario.verificarPassword(password, userEnDB.password)//chequeo de contrase??a
    if (!contrase??asCoinciden) { return res.status(401).json({ accessToken: null, message: 'Usuario o contrase??a invalidos.' }) }

    //creo el token de login y de refresh
    const refreshToken = generateRefreshToken(userEnDB._id)
    const accessToken = generateAccessToken(userEnDB._id, refreshToken)
    const cantidadRefreshs = userEnDB?.refreshTokens?.length + 1;
    const response = await Usuario.findByIdAndUpdate(userEnDB._id, { $push: { refreshTokens: [refreshToken] } }, { new: true })
    response.sesionesActivas = cantidadRefreshs;

    // response.refreshTokens = null; response.password = null; //limpiando, para que en la respuesta no se envien estos datos
    res.json({ perfil: response, accessToken, refreshToken, ATExpiresIn: Date.now() + token_expires * 1000, RTExpiresIn: Date.now() + refresh_expires * 1000 })//envio como respuesta el token, que va a durar 12hs
}


export const newRefreshToken = async (req, res) => {
    const refreshToken = req.headers["x-refresh-token"]
    try {
        const decoded = verifyRefreshToken(refreshToken)
        // if (req.userId !== decoded.id) { return res.status(401).json('._.') }
        await Usuario.findByIdAndUpdate(decoded.id, { $pullAll: { refreshTokens: [refreshToken] } }) //elimino SOLO ese refresh token del usuario que se esta cambiando
        const newRefreshToken = generateRefreshToken(decoded.id)
        await Usuario.findByIdAndUpdate(decoded.id, { $push: { refreshTokens: [newRefreshToken] } }, { new: true })
        const newAccessToken = generateAccessToken(decoded.id, newRefreshToken)
        res.json({ refreshToken: newRefreshToken, accessToken: newAccessToken, ATExpiresIn: Date.now() + token_expires * 1000, RTExpiresIn: Date.now() + refresh_expires * 1000 })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const logout = async (req, res) => {
    try {
        const refreshToken = req.headers["x-refresh-token"] //agarro el refresh token que se me envio y lo guardo
        cerrarSesion(sha256(refreshToken + salt))
        await Usuario.findByIdAndUpdate(req.userId, { $pullAll: { refreshTokens: [refreshToken] } }, { new: true }) //elimino SOLO ese refresh token del usuario
        res.status(204).json({ message: 'Sesiones cerrada', success: true }) //envio el "ok"

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const newAccessToken = async (req, res) => {
    try {
        // return res.status(500).json({ message: error.message })
        const refreshToken = req.headers["x-refresh-token"]//agarro el refresh token que se me envio y lo guardo
        const decoded = verifyRefreshToken(refreshToken) //chequeo si es valido y guardo la data
        const usuarioEnDb = await Usuario.findById(decoded.id).select("refreshTokens") //busco el usuario en la base de datos mediante la id que decode?? arriba. No lo hice en el middleware ya que no le pido al usuario un accesstoken, asi que no puedo acceder a la req.userData
        if (!usuarioEnDb.refreshTokens.includes(refreshToken)) return res.status(403).json({ message: 'Refresh token revoked' }) //chequea si el refresh token est?? habilitado por el usuario y no fue revocado (caso que se desloguee)
        res.json({ accessToken: generateAccessToken(decoded.id, refreshToken), ATExpiresIn: Date.now() + token_expires * 1000, RTExpiresIn: Date.now() }) //envio el nuevo accessToken
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const logoutAllDevices = async (req, res) => {
    try {
        if (!req.body.password) return res.status(401).json({ message: 'Contrase??a invalida' }) //chequeo si envi?? una contrase??a
        const contrase??asCoinciden = await Usuario.verificarPassword(req.body.password, req.userData.password) // chequeo si la contrase??a es valida
        if (!contrase??asCoinciden) return res.status(403).json({ message: 'Contrase??a invalida' }) //si no es valida, devuelvo un error
        cerrarSesionTodosLosDispositivos(req.userId)
        await Usuario.findByIdAndUpdate(req.userId, { refreshTokens: [] }, { new: true }) //elimino todos los refresh tokens del usuario
        res.status(200).json({ message: 'Sesiones cerradas', success: true }) //envio una confirmacion
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
        gen: sha256(refreshToken + salt)
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