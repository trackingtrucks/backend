import { ROLES } from '../Models/Role'
import Usuario from '../Models/Usuario'
export const Roles = async (req, res, next) => {
    const roles = req.body.roles
    if (roles) {
        for (let i = 0; i < roles.length; i++) {
            if (!ROLES.includes(roles[i])) {
                return res.status(400).json({
                    message: `El rol ${roles[i]} no existe.`
                })
            }
        }
    }
    next();
}

export const existeUsuarioOEmail = async (req, res, next) => {
    const email = await Usuario.findOne({ email: req.body.email })
    if (email) return res.status(400).json({ message: 'Email ya existe' })

    next();
}