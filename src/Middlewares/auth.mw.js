import jwt from "jsonwebtoken";
import Usuario from '../Models/Usuario';
import Token from '../Models/Token';
import Tarea from '../Models/Tarea';
import Alerta from '../Models/Alerta';
import Compania from '../Models/Compania';
import config from '../config';
import sha256 from 'js-sha256';
import mongoose from 'mongoose';
const secret = config.SECRET;
const salt = config.SALT;

// const token_expires = config.ACCESS_TOKEN_EXPIRES;

export const verifyCodigoRegistro = async (req, res, next) => {
    try {
        const { codigo } = req.body;
        if (!mongoose.Types.ObjectId.isValid(codigo)) return res.status(400).json({ message: 'Codigo de registro no valido' });
        const response = await Token.findById(codigo)
        if (response.tipo !== "registro") { return res.status(400).json({ message: 'Codigo de registro no valido' }) }
        req.codigoValido = response._id
        req.rolValido = response.rol
        req.companyIdValido = response.companyId
        req.gestorData = {
            email: response?.gestorData?.email,
            id: response?.gestorData?.id
        }
        next()

    } catch (error) {
        return res.status(400).json({ message: 'Codigo de registro no valido' })
    }
}

export const verifyToken = async (req, res, next) => {
    try {
        const accessToken = req.headers["x-access-token"]
        if (!accessToken) return res.status(403).json({ message: 'No token provided' });
        const decoded = jwt.verify(accessToken, secret)
        req.userId = decoded.id
        const userEnDb = await Usuario.findById(req.userId).select("+refreshTokens");
        req.userData = userEnDb;
        req.companyId = userEnDb.companyId;
        userEnDb.refreshTokens.forEach((token, i) => {
            userEnDb.refreshTokens[i] = sha256(token + salt)
        })
        if (!userEnDb.refreshTokens.includes(decoded.gen)) return res.status(401).json({ message: 'Token revoked' });
        if (!userEnDb) return res.status(404).json({ message: 'Usuario no encontrado' })
        next()
    } catch (error) {
        return res.status(400).json({ message: 'No autorizado' })
    }
}
export const verifyTokenWithVehicleData = async (req, res, next) => {
    try {
        const accessToken = req.headers["x-access-token"]
        if (!accessToken) return res.status(403).json({ message: 'No token provided' });
        const decoded = jwt.verify(accessToken, secret)
        req.userId = decoded.id
        const userEnDb = await Usuario.findById(req.userId).select("+refreshTokens").populate("vehiculoActual.id");
        req.userData = userEnDb;
        req.companyId = userEnDb.companyId;
        userEnDb.refreshTokens.forEach((token, i) => {
            userEnDb.refreshTokens[i] = sha256(token + salt)
        })
        if (!userEnDb.refreshTokens.includes(decoded.gen)) return res.status(401).json({ message: 'Token revoked' });
        if (!userEnDb) return res.status(404).json({ message: 'Usuario no encontrado' })
        // const AlertasEnDB = await Alerta.find({vehiculo: req.userData.vehiculoActual.id})
        Promise.all([
            Alerta.find({ vehiculo: req.userData.vehiculoActual.id, companyId: req.companyId }),
            Tarea.find({ vehiculo: req.userData.vehiculoActual.id, companyId: req.companyId })
        ]).then(([AlertasEnDB, TareaEnDB]) => {
            req.alertas = AlertasEnDB;
            req.tareas = TareaEnDB;
            next()

        })
    } catch (error) {
        return res.status(400).json({ message: 'No autorizado', error: error.message })
    }
}
export const verifyTokenWithPassword = async (req, res, next) => {
    try {
        const accessToken = req.headers["x-access-token"]
        if (!accessToken) return res.status(403).json({ message: 'No token provided' });
        const decoded = jwt.verify(accessToken, secret)
        req.userId = decoded.id
        const userEnDb = await Usuario.findById(req.userId).select("refreshTokens").select("password").select("email");
        req.userData = userEnDb;
        req.companyId = userEnDb.companyId;
        userEnDb.refreshTokens.forEach((token, i) => {
            userEnDb.refreshTokens[i] = sha256(token + salt)
        })
        if (!userEnDb.refreshTokens.includes(decoded.gen)) return res.status(401).json({ message: 'Token revoked' });
        if (!userEnDb) return res.status(404).json({ message: 'Usuario no encontrado' })
        next()

    } catch (error) {
        return res.status(400).json({ message: 'No autorizado' })
    }
}

export const verifyTokenWithCompanyData = async (req, res, next) => {
    try {
        const accessToken = req.headers["x-access-token"]
        if (!accessToken) return res.status(403).json({ message: 'No token provided' });
        const decoded = jwt.verify(accessToken, secret)
        req.userId = decoded.id
        const userEnDb = await Usuario.findById(req.userId).select("+refreshTokens");
        req.userData = userEnDb;
        req.companyId = userEnDb.companyId;
        const companyData = await Compania.findOne({companyId: userEnDb.companyId})
        req.company = companyData;
        userEnDb.refreshTokens.forEach((token, i) => {
            userEnDb.refreshTokens[i] = sha256(token + salt)
        })
        if (!userEnDb.refreshTokens.includes(decoded.gen)) return res.status(401).json({ message: 'Token revoked' });
        if (!userEnDb) return res.status(404).json({ message: 'Usuario no encontrado' })
        next()
    } catch (error) {
        return res.status(400).json({ message: 'No autorizado' })
    }
}

export const isGestor = async (req, res, next) => {
    const user = req.userData
    if (user.rol === 'gestor' || user.rol === 'admin') {
        next();
        return;
    }
    return res.status(403).json({ message: 'No tienes los suficientes permisos para realizar esta accion.' })
}

export const isAdmin = async (req, res, next) => {
    const user = req.userData
    if (user.rol === 'admin') {
        req.isAdmin = true;
        next();
        return;
    }
    return res.status(403).json({ message: 'No tienes los suficientes permisos para realizar esta accion.' })
}

export const isConductor = async (req, res, next) => {
    const user = req.userData
    if (user.rol === 'conductor' || user.rol === 'gestor' || user.rol === 'admin') {
        next();
        return;
    }
    return res.status(403).json({ message: 'No tienes los suficientes permisos para realizar esta accion.' })
}

export const onlyConductor = async (req, res, next) => {
    const user = req.userData
    if (user.rol === 'conductor') {
        next();
        return;
    }
    return res.status(403).json({ message: 'No tienes los suficientes permisos para realizar esta accion.' })
}

export const onlyGestor = async (req, res, next) => {
    const user = req.userData
    if (user.rol === 'gestor') {
        next();
        return;
    }
    return res.status(403).json({ message: 'No tienes los suficientes permisos para realizar esta accion.' })
}