import jwt from "jsonwebtoken";
import Usuario from '../Models/Usuario'
import Role from '../Models/Role'
import config from '../config'
const secret = config.SECRET;
export const verifyToken = async (req, res, next) => {
    try {
        const accessToken = req.headers["x-access-token"]
        if (!accessToken) return res.status(403).json({ message: 'No token provided' });
        const decoded = jwt.verify(accessToken, secret)
        req.userId = decoded.id
        const gen = decoded.gen
        const userEnDb = await Usuario.findById(req.userId)
        if (!userEnDb.refreshTokens.includes(gen)) return res.status(401).json({ message: 'Token revoked' }); 
        req.userData = userEnDb;
        if (!userEnDb) return res.status(404).json({ message: 'Usuario no encontrado' })

        next()

    } catch (error) {
        return res.status(400).json({ message: 'No autorizado' })
    }
}

export const isGestor = async (req, res, next) => {
    const user = req.userData
    const roles = await Role.find({_id: {$in: user.roles}});
    for (let i = 0; i < roles.length; i++) {
        const rol = roles[i];
        if (rol.nombre === 'gestor' || rol.nombre === 'admin'){
            next();
            return;
        }
    }
    return res.status(403).json('No tienes los suficientes permisos para realizar esta accion.')
}

export const isAdmin = async (req, res, next) => {
    const user = req.userData
    const roles = await Role.find({_id: {$in: user.roles}});
    for (let i = 0; i < roles.length; i++) {
        const rol = roles[i];
        if (rol.nombre === 'admin'){
            next();
            return;
        }
    }
    return res.status(403).json('No tienes los suficientes permisos para realizar esta accion.')
}